﻿import _flatten from 'lodash/flatten.js'
import _isNumber from 'lodash/isNumber.js'
import _intersectionWith from 'lodash/intersectionWith.js'
import _intersection from 'lodash/intersection.js'

import { CommonHelper } from 'gachchan'
import { DateTimeHelper } from 'gachchan'

export class StockvnHelper {
  /**
   * StockCompany usually represent 1000000 (1 million) as 1,000,000
   * We need to convert it to 1000000
   * @param num
   */
  static standardizeVolNumber(num: string | number): number {
    if (typeof num === 'number') {
      return num as number
    }

    // undefined or null
    if (!num) {
      return NaN
    }

    let ret = ''
    if (typeof num === 'string') {
      ret = num.replace(/,/g, '')
    }
    // else{
    //   // is number, do nothing
    // }

    return CommonHelper.toNumber(ret)
  }

  /**
   * continuous checkWorkingHours and call callbackFn with interval
   * @param {*} callbackFn
   * @param {*} interval
   */
  static continuousExecuteInWorkingHours(callbackFn: Function, interval: number) {
    if (!callbackFn) {
      return
    }

    let timerId = setInterval(async () => {
      // only perform callback in trading hours
      if (this.isInWorkingHours() && this.isInWorkingDays()) {
        await callbackFn()
      } else {
        // console.debug(now, "out of trading hour, I don't refresh signal to save network consumption")
      }
    }, interval)

    return timerId
  }

  /** return current `hhmm` timestring in GMT7 timezone */
  static getCurrentGMT7HoursMinutesString() {
    const gmt7time = DateTimeHelper.getTimeInGMTTimezone(7)
    const hhmm = DateTimeHelper.getCurrentHoursMinutesString(gmt7time)
    return hhmm
  }

  /** return current `hhmmss` timestring in GMT7 timezone */
  static getCurrentGMT7HoursMinutesSecondsString() {
    const gmt7time = DateTimeHelper.getTimeInGMTTimezone(7)
    const hhmmss = DateTimeHelper.getCurrentHoursMinutesSecondsString(gmt7time)
    return hhmmss
  }

  /**
   * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check stricly inside 0845-1130 or 1300-1445
   * @param {Date} now
   * @returns boolean
   */
  static isInWorkingHours() {
    if (!this.isInWorkingDays()) {
      return false
    }

    const hhmm = this.getCurrentGMT7HoursMinutesString()
    if (('0845' <= hhmm && hhmm <= '1130') || ('1300' <= hhmm && hhmm <= '1445')) {
      return true
    } else {
      return false
    }
  }

  /**
   *  is in ATO sessions (stricly inside 0845-0915)
   * @param {String} nowString hhhmm string, like "1130" or "0959"
   */
  static isIn_ATO_Sessions(nowString?: string) {
    if (!nowString) {
      nowString = this.getCurrentGMT7HoursMinutesString()
    }

    if (!this.isInWorkingDays()) {
      return false
    }

    if ('0845' <= nowString && nowString <= '0915') {
      return true
    }

    return false
  }
  /**
   *  is in ATC sessions (strictly inside 1430-1445)
   * @param {String} nowString hhhmm string, like "1130" or "0959"
   */
  static isIn_ATC_Sessions(nowString?: string) {
    if (!nowString) {
      nowString = this.getCurrentGMT7HoursMinutesString()
    }

    if (!this.isInWorkingDays()) {
      return false
    }

    if ('1430' <= nowString && nowString <= '1445') {
      return true
    }

    return false
  }

  /**
   * return true if current moment is Monday to Friday (Vietnam working days) in GMT+7 timezone
   */
  static isInWorkingDays() {
    const gmt7time = DateTimeHelper.getTimeInGMTTimezone(7)

    // Sunday - Saturday : 0 - 6
    const currentDay = gmt7time.getDay()
    if (0 < currentDay && currentDay < 6) {
      return true
    }

    return false
  }

  /**
   * return true if s is like HNXINDEX, I3-FIN
   * @param str SymbolCode (HPG, HNXINDEX, I3-FIN)
   */
  static isCompoundIndexSymbolCode(str: string) {
    if (str.search(/^I\d\-/i) == 0) {
      return true
    }

    if (str.search(/INDEX/) >= 0) {
      return true
    }

    return false
  }
}
