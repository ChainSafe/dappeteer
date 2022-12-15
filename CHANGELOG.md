# Changelog

## [4.0.0](https://github.com/ChainSafe/dappeteer/compare/v3.0.0...v4.0.0) (2022-12-15)


### ⚠ BREAKING CHANGES

* replace outdated methods ([#189](https://github.com/ChainSafe/dappeteer/issues/189))
* add playwright support ([#167](https://github.com/ChainSafe/dappeteer/issues/167))
* update recommended metamask version ([#151](https://github.com/ChainSafe/dappeteer/issues/151))
* casing of MetaMask ([#132](https://github.com/ChainSafe/dappeteer/issues/132))

### Features

* ability to install snap ([#154](https://github.com/ChainSafe/dappeteer/issues/154)) ([0aaad28](https://github.com/ChainSafe/dappeteer/commit/0aaad28f8cc4b2654a489f1c6c07319ee44bf4d7))
* add ability to accept dialogs ([#138](https://github.com/ChainSafe/dappeteer/issues/138)) ([#164](https://github.com/ChainSafe/dappeteer/issues/164)) ([f777a9a](https://github.com/ChainSafe/dappeteer/commit/f777a9a0bd569cbd860770b82ff91f6e8e03152e))
* Add invokeSnap method; update installSnap method parameter; ([#159](https://github.com/ChainSafe/dappeteer/issues/159)) ([17f2849](https://github.com/ChainSafe/dappeteer/commit/17f284903d216121dedd98b0168b9514b0e49b74))
* add playwright support ([#167](https://github.com/ChainSafe/dappeteer/issues/167)) ([c4c0e5f](https://github.com/ChainSafe/dappeteer/commit/c4c0e5fc1af087230cbc5bc1c611230ebaa2c075))
* add support for installing metamask flaask ([71cf265](https://github.com/ChainSafe/dappeteer/commit/71cf265408fe001a648b90b7eef8fe0e11c17294))
* add support for installing metamask flask ([#153](https://github.com/ChainSafe/dappeteer/issues/153)) ([71cf265](https://github.com/ChainSafe/dappeteer/commit/71cf265408fe001a648b90b7eef8fe0e11c17294))
* added notification snap to methods-snap [#137](https://github.com/ChainSafe/dappeteer/issues/137) ([#166](https://github.com/ChainSafe/dappeteer/issues/166)) ([ae17944](https://github.com/ChainSafe/dappeteer/commit/ae17944ed8790611b69dfdb55439946d30639013))
* allow signing typed data ([#191](https://github.com/ChainSafe/dappeteer/issues/191)) ([086ecbd](https://github.com/ChainSafe/dappeteer/commit/086ecbdbdabdbc700c5a2e1902dd0fc811db411d))
* method to bootstrap snap env ([#180](https://github.com/ChainSafe/dappeteer/issues/180)) ([0fb3465](https://github.com/ChainSafe/dappeteer/commit/0fb3465e879dd68014fb0f8cca8e2c6efdc4ca11))
* replace outdated methods ([#189](https://github.com/ChainSafe/dappeteer/issues/189)) ([9fcf255](https://github.com/ChainSafe/dappeteer/commit/9fcf2551d5fb64c41f5ac0d165bc35a3ab399193))
* Simplify `installSnap` and `initSnapEnv` apis ([#206](https://github.com/ChainSafe/dappeteer/issues/206)) ([d7c51f9](https://github.com/ChainSafe/dappeteer/commit/d7c51f948d01230c04603e289375af03e872289d))
* snap notifications 137 ([#187](https://github.com/ChainSafe/dappeteer/issues/187)) ([794465c](https://github.com/ChainSafe/dappeteer/commit/794465c4f30fa2bc60f46f8c3455297dcc7aa815))
* update recommended metamask version ([#151](https://github.com/ChainSafe/dappeteer/issues/151)) ([ccb3215](https://github.com/ChainSafe/dappeteer/commit/ccb321579d6773c63b86eb8ff8f889a9c3d3bf6d))


### Bug Fixes

* casing of MetaMask ([#132](https://github.com/ChainSafe/dappeteer/issues/132)) ([c0a41aa](https://github.com/ChainSafe/dappeteer/commit/c0a41aa5a27986e27d63f2448692affe5986a01e))
* fix prompt clicking flakiness, fix multiple snap key permissions ([#194](https://github.com/ChainSafe/dappeteer/issues/194)) ([fe03f89](https://github.com/ChainSafe/dappeteer/commit/fe03f89a5fb494f88cd5778641c8d1d4a831a8f8))
* import token flaky ([#149](https://github.com/ChainSafe/dappeteer/issues/149)) ([bfce149](https://github.com/ChainSafe/dappeteer/commit/bfce1498d4fc566ed1fc3f64e2c98ba0673b1e13))
* import-token flakyness ([bfce149](https://github.com/ChainSafe/dappeteer/commit/bfce1498d4fc566ed1fc3f64e2c98ba0673b1e13))
* remove page param from install snap ([#188](https://github.com/ChainSafe/dappeteer/issues/188)) ([2678119](https://github.com/ChainSafe/dappeteer/commit/2678119efaffee748d33e90425b7c3370e01acdb))
* selector issues, useless timeouts, reorganise tests ([#145](https://github.com/ChainSafe/dappeteer/issues/145)) ([babdd28](https://github.com/ChainSafe/dappeteer/commit/babdd285bcaa8f85debdd57d23514dafc22ef493))
* snap install faster, run all tests ([#163](https://github.com/ChainSafe/dappeteer/issues/163)) ([04b8a00](https://github.com/ChainSafe/dappeteer/commit/04b8a004a7ec1994bc7b667b6bc2321e26ae826b))


### Miscellaneous

* change eslint config to chainsafe shared ([#152](https://github.com/ChainSafe/dappeteer/issues/152)) ([4aa5ca2](https://github.com/ChainSafe/dappeteer/commit/4aa5ca2c72a2eba627fd09155e3c973cd72e1862))
* Ci enhancement ([#193](https://github.com/ChainSafe/dappeteer/issues/193)) ([7082c98](https://github.com/ChainSafe/dappeteer/commit/7082c98c5f7851ae3fc5af4c6ed76ae6634ec186))
* Deprecate button clicks for tests ([#195](https://github.com/ChainSafe/dappeteer/issues/195)) ([bb11a88](https://github.com/ChainSafe/dappeteer/commit/bb11a889fa0d9cd1c31a61d1bed60fc930293a29))
* merge unstable into master ([#179](https://github.com/ChainSafe/dappeteer/issues/179)) ([fed0b60](https://github.com/ChainSafe/dappeteer/commit/fed0b60606ea4a7c587469e25a7773d962a59419))
* node engine requirements ([#184](https://github.com/ChainSafe/dappeteer/issues/184)) ([#186](https://github.com/ChainSafe/dappeteer/issues/186)) ([2d86a6d](https://github.com/ChainSafe/dappeteer/commit/2d86a6d4f676d9fdc964b1db1da00bed3951e3a9))
* Remove local server for dapp ([#203](https://github.com/ChainSafe/dappeteer/issues/203)) ([a0c682f](https://github.com/ChainSafe/dappeteer/commit/a0c682f085b936b4fbb60d170216857cc247ce8f))
* remove metamask dir ([#185](https://github.com/ChainSafe/dappeteer/issues/185)) ([d703be8](https://github.com/ChainSafe/dappeteer/commit/d703be8f94bcd8c75277a1e847aca3000cbb3706))
* update CI for unstable branch ([3caf78d](https://github.com/ChainSafe/dappeteer/commit/3caf78d77890eac96dd4a19543d8a727062d1eb2))
* Update documentation and Readme ([#202](https://github.com/ChainSafe/dappeteer/issues/202)) ([e8c245e](https://github.com/ChainSafe/dappeteer/commit/e8c245eacf7533d58eb64af3c54f8d2969a99fb8))

## [3.0.0](https://github.com/ChainSafe/dappeteer/compare/v3.0.0-rc.0...v3.0.0) (2022-09-30)


### Bug Fixes

* jest config ([#131](https://github.com/ChainSafe/dappeteer/issues/131)) ([2151b67](https://github.com/ChainSafe/dappeteer/commit/2151b67eb70f729e118abea7a00f250f688a24d7))
* README.md ([#122](https://github.com/ChainSafe/dappeteer/issues/122)) ([1855a8a](https://github.com/ChainSafe/dappeteer/commit/1855a8a144ed5439616c834f9188e006b658a0ff))
* update ganache, fix test depending on goerli ([#144](https://github.com/ChainSafe/dappeteer/issues/144)) ([#148](https://github.com/ChainSafe/dappeteer/issues/148)) ([c85a8aa](https://github.com/ChainSafe/dappeteer/commit/c85a8aaa73251323d367bcc921131caa94455ed1))


### Miscellaneous

* release 3.0.0 ([dbf00a0](https://github.com/ChainSafe/dappeteer/commit/dbf00a0ed24d428ded4f2291c4e7de31d535475b))
* remove rc ([#125](https://github.com/ChainSafe/dappeteer/issues/125)) ([dbf00a0](https://github.com/ChainSafe/dappeteer/commit/dbf00a0ed24d428ded4f2291c4e7de31d535475b))
* standard release process ([b30043a](https://github.com/ChainSafe/dappeteer/commit/b30043a2185bc49b25bf5f4ae12e669b106a7ccb))
