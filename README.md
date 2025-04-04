# gachchan-finance: common financial funcs for both Serverside and Clientside

## Install

run `npm i gachchan-finance`

## Notable Dependencies

- gachchan
- nanoid
- Fully TypeScript
- Use Parcel to build

Peers

- lodash
- decimal.js

## Sponsors

https://github.com/sponsors/lockevn

---

# To publish/release

- change `package.json` version string
- (Optional) run in local those commands `pnpm run ci` and `pnpm release` to build the output package (to test)
- Create git tag and publish the git tag

[![npm version](https://badgen.net/npm/v/gachchan-finance)](https://npm.im/gachchan-finance) [![npm downloads](https://badgen.net/npm/dt/gachchan-finance)](https://npm.im/gachchan-finance)

---

# Development

### TECH NOTE: How we setup Deps

This lib `gachchan-finance` use `_intersection from 'lodash/intersection'` to import function from `lodash`

- `_intersection` will not be bundled into `gachchan-finance` by default. When you write `import \_intersection from 'lodash/intersection'`, it creates a dependency that expects `lodash` to be available at runtime.

- Specify `"peerDependencies":  {    "lodash": "^4.17.21"   }`​ in `gachchan-finance`.

  > You're using `lodash` but want to allow the consuming project to control the `lodash` version
  > It prevents multiple copies of `lodash` in the final application
  > It makes it clear to users of `gachchan-finance` that they need to install `lodash`

- Do `tts-wallet` (which use `gachchan-finance`) need to depend on `lodash`?

  - Yes, `tts-wallet` needs to install `lodash` as a direct dependency because:
  - It's a peer dependency of `gachchan-finance`
    The import statements in `gachchan-finance` expect to find `lodash` in `node_modules`
  - If `tts-wallet` doesn't install `lodash`, you'll get runtime errors about missing modules

### TECH NOTE: build with Parcel

- Parcel to build https://dev.to/ihaback/create-your-own-typescript-library-with-parceljs-3dh7
- Package manager [pnpm](https://pnpm.js.org/)
- Release with [semantic-release](https://npm.im/semantic-release)
- Test with https://vitest.dev
