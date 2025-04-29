export namespace StockvnModels {
  /** DTO with open low high price */
  export interface SymbolOLHInfo {
    /** open price */
    op?: number

    /** lowest price */
    lp?: number

    /** highest price */
    hp?: number
  }

  /** DTO with ref price, ceiling and floor price */
  export interface SymbolRefCeilingFloorInfo {
    /** ref price, also is cp: close price */
    rp: number

    /** ceiling price */
    cep?: number

    /** floor price */
    flp?: number
  }

  /** DTO with bid (buy) and offer (sell) price */
  export interface SymbolBidOfferInfo {
    /** bid price */
    b1p?: number
    b2p?: number
    b3p?: number
    b1v?: number
    b2v?: number
    b3v?: number

    /** ask price */
    o1p?: number
    o2p?: number
    o3p?: number
    o1v?: number
    o2v?: number
    o3v?: number
  }

  export type StockvnSymbolCategory = 'cs' | 'cw' | undefined
  export type StockMarket = 'HSX' | 'HNX' | 'UPCOM' | string | undefined

  /** DTO with some metadata like source, name, market ... */
  export interface SymbolMetadataInfo {
    name?: string
    name2?: string

    /** extra text information */
    description?: string

    /** exchange, MUST BE in uppercase format */
    market?: StockMarket

    category?: StockvnSymbolCategory

    session?: string

    /** where we get this DTO */
    source?: string

    tags?: string[]
  }

  /** DTO with some extra Aggregation data about symbol (avg, total value/vol intraday, ...) */
  export interface SymbolAggregateDataInfo {
    /** avg price */
    avgp?: number

    /** listed Share on exchange, khối lượng cổ phiếu lưu hành */
    totalVolAvailable?: number

    /** nmTotalTradedQty) // tổng vol giao dịch hôm nay */
    intradayVolTraded: number
    /** tổng giá trị giao dịch hôm nay */
    intradayValueTraded?: number

    /** buyForeignQtty, NN mua */
    foreignbv?: number

    /** sellForeignQtty, NN bán */
    foreignsv?: number

    /** foreign room vol */
    foreignroomv?: number
  }

  /** metadata about TA fields (RSI, EMA ...) */
  interface TAMetadataInfo {
    rsi?: number
    /** percentage to be sideway */
    sideway?: number
    rating?: string
    trend?: string
    base?: string
  }

  /** ID, vol, mp */
  export interface SymbolBasicInfo {
    /** symbol */
    s: string
    /** used to be symbol */
    id: string

    /** matchedPrice
     * @note 20 == 20k VND */
    mp: number
    /** vol */
    v: number

    /** matched price changed value */
    mpChange?: number

    /** matched price priceChangePercent, 2.5 is 2.5% */
    mpChangePercent?: number
  }

  /** with TAMetadata and AggregateData */
  export interface StandardStockvnInfo
    extends SymbolBasicInfo,
      SymbolMetadataInfo,
      SymbolAggregateDataInfo,
      //
      SymbolOLHInfo,
      SymbolRefCeilingFloorInfo,
      TAMetadataInfo {
    /** is in XCapital focus (editor choice) list */
    isXCapitalFocus?: boolean
  }

  export interface PutThroughOrderStockvnInfo extends SymbolBasicInfo, SymbolOLHInfo, SymbolRefCeilingFloorInfo, SymbolMetadataInfo {
    /** value of this order, in kilo (1000 ==> val = 1) */
    val: number

    /** // tổng vol tích luỹ tới lệnh thoả thuận này */
    intradayTotalVolTraded: number
    /** tổng giá trị tích luỹ tới lệnh thoả thuận này */
    intradayTotalValueTraded: number

    /** timestamp */
    ts?: string

    /** extra prop, decorated with the CS StockvnInfo */
    stockInfo?: StandardStockvnInfo
  }

  /* ============= */
  /* ============= */
  /* ============= */
  export type CWSignalType = 'PERFECT' | 'GOOD' | 'BAIT' | 'BIG_Q_DIFF' | 'NOT_LISTED' | 'NEWBORN' | 'BABY'
  export type CWSignalTag = CWSignalType | 'HOLD' | 'POTENTIAL' | 'DEADCAT' | 'MATURITY' | 'WOLFDANCE'

  type CWQuality_Focus = 'VeryFocus' | 'Focus'
  type CWQuality_GoodBad = 'VeryGood' | 'Good' | 'Normal' | 'VeryBad' | 'Bad'

  /**
   * giá thực hiện < giá thanh toán CS ==> lãi ITM.
   
  giá thực hiện > giá thanh toán CS ==> lỗ OTM.

  hoà vốn 'ATM'
   */
  export type CW_ExerciseStatus = 'ITM' | 'OTM' | 'ATM'

  export interface CWIssuer {
    code: string
    rank?: number
    note?: string
  }

  export interface CWIPOInfo extends SymbolMetadataInfo {
    s: string // 'CVRE2323'
    cwName?: string // 'CQ CVRE2323',

    /** 1 == 1000 VND. giá chuyển đổi hay giá thực hiện, Là mức giá (của CPCS) tổ chức phát hành thiết lập từ đầu và được sử dụng để xác định một CW có ở trạng thái có lãi tại thời điểm đáo hạn */
    exercisePrice: number
    /** (also known as warrants per share) số lượng CW cần để đổi lấy 01 CKCS khi đáo hạn */
    exerciseRatio: number

    /** text string of exerciseRatio, like "4:1" */
    exerciseRatioRaw: string

    totalVolAvailable?: number

    issuer?: string //  'VPBankS',
    /** can be provided from serverside, or decorate in clientside (to save data transfer payload) */
    issuerInfo?: CWIssuer

    /** ngày phát hành (trước khi giao dịch), có thể lấy giá CPCS tại thời điểm này để tính toán NEWBORN */
    issuedDate?: string // 20240703
    /** can be undefined */
    firstTradingDate?: string // 20240703
    lastTradingDate?: string // 20240703
    expiryDate?: string // 20240703
    maturityDate?: string // 20240703

    /** this CW is expired or not */
    computed_expired?: boolean

    /** undefined is invalid value (when we cannot parse&calculate from source) */
    computed_elapsedDays?: number

    /** in kilo VND. 3 ==> 3000 VND */
    valuation?: number

    /** computed field */
    valuationIndex?: number
  }

  /**CWInfo with Gurucore computed props */
  export interface CWComputedInfo {
    /** Break-even: Giá hoà vốn */
    computed_GHV?: number

    /** giá của CKCS hiện tại */
    computed_UnderlyingSymbol_mp: number
    /** Giá thanh toán chứng quyền khi thực hiện quyền là bình quân giá đóng cửa của chứng khoán cơ sở trong năm (05) ngày giao dịch liền trước ngày đáo hạn, không bao gồm ngày đáo hạn (Quy chế Giao dịch Chứng khoán tại Sở Giao dịch Chứng khoán TP.HCM). */
    computed_UnderlyingSymbol_maturityPrice: number

    computed_infoUnderlyingSymbol_mpChangePercent_Quality: CWQuality_Focus

    /** trạng thái đang lãi:ITM lỗ:OTM hay hoà:ATM */
    computed_CWStatus: CW_ExerciseStatus
    computed_Delta: number
    computed_EG: number
    /** MaturityProfitPerCW = lợi nhuận trên 1 CW khi đáo hạn.
     * Nếu là một giá trị dương ==> lãi ước tính trên một CW = (giá CKCS hiện tại - giá thực hiện) / tỷ lệ chuyển đổi */
    computed_MaturityBasis: number
    /** tỷ lệ giữa lãi trên 1 CW (MaturityBasis) với giá của CW. (Xem CW có rỗng hay không)
     * Số này càng lớn càng tốt, nếu giá trị này lớn hơn 100% (MaturityBasis > CW.price) thì mua là hời luôn.
     */
    computed_MaturityBasisCWPricePercent: number

    /** CPCS price need to go to this value ==> this CW reach BreakEven */
    computed_ToBreakEven: number
    /** CPCS price need to raise up this % ==> this CW reach BreakEven */
    computed_ToBreakEvenPercent: number

    computed_TodayVolPercent: number
    computed_TodayVolPercent_Quality?: CWQuality_Focus
    computed_ForeignerNetBuyingPercent: number
    computed_ForeignerNetBuyingPercent_Quality?: CWQuality_GoodBad
    computed_ToBreakEvenPercent_Quality?: CWQuality_GoodBad
    computed_MaturityBasisCWPricePercent_Quality?: CWQuality_GoodBad
    computed_EG_Quality?: CWQuality_GoodBad

    /** số ngày còn lại (tính tới ngày đáo hạn maturityDate) */
    computed_remainDays: number
    /** time-value of the CW, run from 1 to 0, exponential, parabolic */
    computed_timeValue: number
    computed_remainDays_Quality?: CWQuality_GoodBad

    /** cw.computed_remainDays <= CW_REMAINDAY_TO_CONSIDER_SHORTTERM (30) */
    computed_ShortTerm: boolean

    /** + Nhà đầu tư có thể theo dõi thông tin Giao dịch tự doanh đối với CW mục tiêu để ước lượng số CW mà CTCK còn tồn kho. Ngoài ra nhà đầu tư có thể quan sát sự thay đổi lệnh đặt của CW để nhận biết CW có đang được TLTT bởi CTCK hay không. Thông thường, nếu CTCK còn tồn kho CW, lệnh đặt TLTT của CTCK sẽ thay đổi đồng điệu và tương ứng với những diễn biến của CKCS. Ngược lại, nếu CTCK đã không còn CW, lệnh đặt trên thị trường là lệnh của các nhà đầu tư thứ cấp khác, họ không có nghĩa vụ phải TLTT cho CW, các lệnh đặt của CW sẽ ít thay đổi hơn.
+ Nhà đầu tư mua mới CW nên tránh các CW đã không còn tồn kho ở phía CTCK vì 2 nguyên nhân:
CW có thể đang được ở mức định giá không còn hấp dẫn cầu đã vượt xa cung
CW sẽ không được TLTT một cách đầy đủ dẫn tới việc nhà đầu tư khó vào và ra trạng thái lớn. */
    computed_TODO_TonKhoTaoLap: number

    q_point: number
    /** current q_point - last sent q_point */
    q_pointChange: number
    q_evals: CWSignalTag[]
    q_grade: CWSignalType
  }

  export interface CWStockvnInfo
    extends SymbolBasicInfo,
      SymbolMetadataInfo,
      SymbolAggregateDataInfo,
      //
      SymbolOLHInfo,
      SymbolRefCeilingFloorInfo,
      SymbolBidOfferInfo,
      //
      CWIPOInfo {
    underlyingSymbol?: string // 'VRE'
  }

  /** CW with extra computed fields */
  export interface ExtraCWStockvnInfo extends CWStockvnInfo, CWComputedInfo {
    infoUnderlyingSymbol: StandardStockvnInfo

    /** simple object to store information af what we sent via chat channel about this CW */
    notification: CWNotification
  }

  /** to notify via chat channel about CW */
  export interface CWNotification {
    /** haven't sent or not */
    shouldSend: boolean
  }

  /* ============= */
  /* ============= */
  /* ============= */
  export type FinboxCSOrderType = 'BUY' | 'SELL' | 'TP' | 'ACCU' | 'SOLD'

  export interface FinboxOverviewMarketTwoRawRecord {
    ticker: string
    date: string // Alternatively, you can use Date type if needed for date manipulation

    priceFlat: number
    pf: number // Assuming pf stands for previous day's closing price
    pc: number // Assuming pc stands for previous day's high price

    pricePercent: number
    volumeFlat: number
    volumePercent: number

    trend: string // Assuming trend is a human-readable string (e.g., "TĂNG" for uptrend)
    signal: string // Assuming signal is a human-readable string (e.g., "BUY")
    point: number
    noise: number
    rsi: number

    giaodichnn: number // Assuming giaodichnn is a specific financial metric

    pe: number
    gia_thuc_hien: number // Assuming gia_thuc_hien is the current price
    roe: number

    rating: string // Assuming rating is a letter grade (e.g., "B+")
    company: string
    industry: string
    note: string

    wait_signal: string // Assuming wait_signal is a human-readable string (e.g., "HOLD")
    wait_price: number
    wait_score: number

    rs_rating: number
    rs_rating_rank: number
    ct_rs_rating_rank: number

    fs_rating: number
    fs_rating_rank: number
    ct_fs_rating_rank: number

    pricePercent5: number
    pricePercent20: number
    pricePercent60: number
  }

  export interface FinboxOverviewMarketTwoData {
    overview: any
    buy_standard: FinboxOverviewMarketTwoRawRecord[]
    buy_normal: FinboxOverviewMarketTwoRawRecord[]
    sell_standard: FinboxOverviewMarketTwoRawRecord[]
    sell_normal: FinboxOverviewMarketTwoRawRecord[]
    wait_buy_standard: FinboxOverviewMarketTwoRawRecord[]
    wait_buy_normal: FinboxOverviewMarketTwoRawRecord[]
    wait_sell_standard: FinboxOverviewMarketTwoRawRecord[]
    wait_sell_normal: FinboxOverviewMarketTwoRawRecord[]
    basis_standard: FinboxOverviewMarketTwoRawRecord[]
    basis_normal: FinboxOverviewMarketTwoRawRecord[]
    rsi_standard: FinboxOverviewMarketTwoRawRecord[]
    rsi_normal: FinboxOverviewMarketTwoRawRecord[]
    volume_standard: FinboxOverviewMarketTwoRawRecord[]
    volume_normal: FinboxOverviewMarketTwoRawRecord[]
    foreign_buy: FinboxOverviewMarketTwoRawRecord[]
    foreign_sell: FinboxOverviewMarketTwoRawRecord[]
    sector_increase: FinboxOverviewMarketTwoRawRecord[]
    sector_decrease: FinboxOverviewMarketTwoRawRecord[]
  }

  /** signal parsed from Finbox Overview */
  export interface FinboxOverviewSignalInfo extends TAMetadataInfo {
    s: string
    fullname: string
    industry: string

    ts: string

    ordertype: FinboxCSOrderType
    orderp: number
    orderstatus: boolean

    pe: number
  }

  export interface PSSignalDirection {
    direction?: 'LONG' | 'SHORT' | ''
    explanation: string
  }

  /** signal parsed from Finbox PS */
  export interface FinboxPSSignalInfo extends TAMetadataInfo {
    s: 'VN30F1M' | string

    tsObject: Date

    /** date and time, 20240620111200 */
    ts: string

    /** OVERNIGHT: trạng thái của lệnh cuối ngày (giữ qua đêm) */
    orderMixTrading: 'OVERNIGHT' | 'LONG' | 'SHORT' | 'LONGHALF' | 'SHORTHALF' | 'NOTHING'
    orderTrendTrading: 'NOTHING' | 'SHORT' | 'LONG'
    /** giá vào lệnh */
    matchPriceMixTrading: number

    base: 'SIDEWAY' | 'NOTHING'
    trend: 'DECREASE' | 'INCREASE'
    trendToShow: 'DECREASE' | 'INCREASE'

    turn: number

    signalDirection: PSSignalDirection
  }

  /** signal parsed from Finbox CS */
  export interface FinboxCSSignalInfo extends SymbolBasicInfo, SymbolMetadataInfo, FinboxOverviewSignalInfo {
    orderts: string

    point: number
    plan: {
      signal: string // "CHỜ MUA",
      signalPrice: number //22.5,
      signalScore: number // 52
    }
    signalNote: string
  }

  /** Raw type from Finbox API */
  export interface FinboxCSSignal_Raw {
    ticker: string // MSN
    date: string // '20231221'
    rating: string // 'A-'
    priceFlat: number // 63.7
    pricePercent: number // -0.003

    buyDate: string // '20231208'
    buyPrice: number // 64.8
    sellDate: string // '20240618',
    sellPrice: number // 48.65,
    profit: number // -0.017

    company: string // 'Tập đoàn Masan'
    industry: string // 'Thực phẩm'
  }

  export interface FinboxCSSignal extends Partial<FinboxCSSignal_Raw>, Partial<SymbolBasicInfo>, SymbolMetadataInfo {
    ts: string
    orderType: FinboxCSOrderType
    /** Finbox category of this signal */
    symbolcat: string
    /** day from buy to sell date */
    duration?: number
  }

  export interface SymbolNewsArticle extends SymbolMetadataInfo {
    title: string
    originUrl: string
    slug: string
    created: string
  }

  /** Extra data about Issuers.
   * Đánh giá dựa trên độ thanh khoản dồi dào, chạy giá, chịu khó kê lệnh cho investor mua bán
   */
  export const CWIssuersInfo = {
    SSI: {
      rank: 1,
      note: 'Nhà tạo lập kỳ cựu, nhiều hàng nhất, vol cũng lớn nhất',
    },
    KIS: {
      rank: 1,
      note: 'Rất hay lái mạnh đẩy mạnh tạo thanh khoản. Phát hành rất nhiều CW, hàng CW có vốn hoá từ cỡ nhỏ tới trung bình. Thị trường chung đang xuống thì KIS hay lợi dụng đạp',
    },
    KISVN: {},
    VND: {
      rank: 1,
      note: 'Nhà tạo lập cỡ vừa',
    },

    ACBS: {
      rank: 2,
      note: 'Nhà tạo lập mới của thị trường CW, ít hàng',
    },
    MBS: {
      rank: 2,
      note: 'Nhà tạo lập cỡ vừa, thi thoảng có đẩy giá',
    },

    SSV: {
      rank: 2,
      note: 'Chưa rõ, Nhà tạo lập mới',
    },
    PHS: {
      rank: 2,
      note: 'Chưa rõ, Nhà tạo lập mới',
    },
    TCBS: {
      rank: 2,
      note: 'Nhà tạo lập OK',
    },
    VPBS: {
      rank: 2,
      note: 'Nhà tạo lập OK',
    },

    HSC: {
      rank: 2,
      note: 'Nhà tạo lập kỳ cựu, nhiều hàng',
    },

    BSC: {
      rank: 3,
      note: 'Nhà tạo lập mới, LỞM',
    },
    VCSC: {
      rank: 3,
      note: 'Chính là VCI, đánh rất khó chịu, khó thanh khoản, giá TH thường cao, vol rất thấp, vốn hoá nhỏ, ít đặt lệnh tạo lập',
    },
    VCI: {
      rank: 3,
      note: '(Cũng là VCSC) đánh rất khó chịu, khó thanh khoản, giá TH thường cao, vol rất thấp, vốn hoá nhỏ, ít đặt lệnh tạo lập',
    },
  }
  CWIssuersInfo.KISVN = CWIssuersInfo.KIS

  /** array of all predefined games */
  export const CWGameStyleList = [
    {
      Key: '__PERFECT',
      DisplayText: '',
      Tip: 'Bestbuy',
    },
    {
      Key: '__GOOD',
      DisplayText: '',
      Tip: 'Tiềm năng, nhưng chưa lên được level PERFECT',
    },
    {
      Key: '__POTENTIAL',
      DisplayText: 'Betting (risk+)',
      Tip: 'Điểm chất lượng khá, cấp số nhân EG cao, High risk / high return',
      NewSequence: true,
    },
    {
      Key: '__NEWBORN',
      DisplayText: 'NewBorn (risk++)',
      Tip: 'Mới phát hành, mới niêm yết giao dịch trên sàn',
    },
    {
      Key: '__MATURITY',
      DisplayText: 'Maturity (risk+)',
      Tip: 'Điểm khá cao và gần sát đáo hạn. Dành cho ai bet với vol lớn mà không thể xả được có lời (phải ép nhà cái mua lại khi đáo hạn)',
    },
    {
      Key: '__HOLD',
      DisplayText: '',
      Tip: 'Điểm khá cao, có khối lượng giao dịch đột biến đáng chú ý trong ngày, có thể trade hoặc hold dài hạn hơn',
      NewSequence: true,
    },
    {
      Key: '__WOLFDANCE',
      DisplayText: 'Wolf',
      Tip: 'Biến động lớn của NN (có thể có cả yếu tố của nhà cái), tiền dồn vào/ra với tỷ trọng lớn trong ngày (báo hiệu sắp bơm hoặc xả mạnh).',
    },
  ]
}
