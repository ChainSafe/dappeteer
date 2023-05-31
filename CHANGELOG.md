# Changelog

## [5.2.0](https://github.com/ChainSafe/dappeteer/compare/v5.1.1...v5.2.0) (2023-05-31)


### Features

* custom automation ([#332](https://github.com/ChainSafe/dappeteer/issues/332)) ([e25032f](https://github.com/ChainSafe/dappeteer/commit/e25032f5d129ad7c15aff36e6aabcef39b823d0f))
* support MetaMask v10.31.0 ([#335](https://github.com/ChainSafe/dappeteer/issues/335)) ([3ad1b56](https://github.com/ChainSafe/dappeteer/commit/3ad1b568a866c69c2b63819372bf89d1fc8e023f))


### Bug Fixes

* use params in InvokeSnap method ([#334](https://github.com/ChainSafe/dappeteer/issues/334)) ([509e22b](https://github.com/ChainSafe/dappeteer/commit/509e22bdf886e3e8b10e1754eade679d105ab4fb)), closes [#333](https://github.com/ChainSafe/dappeteer/issues/333)

## [5.1.1](https://github.com/ChainSafe/dappeteer/compare/v5.1.0...v5.1.1) (2023-05-03)


### Bug Fixes

* package publish ([#328](https://github.com/ChainSafe/dappeteer/issues/328)) ([f05f174](https://github.com/ChainSafe/dappeteer/commit/f05f1749e47db31ec05afe8cea01205f837555a3))

## [5.1.0](https://github.com/ChainSafe/dappeteer/compare/v5.1.0...v5.1.0) (2023-05-03)


### Features

* triage issues github actions ([#301](https://github.com/ChainSafe/dappeteer/issues/301)) ([774958e](https://github.com/ChainSafe/dappeteer/commit/774958ea7dc92b77175bcbb89c736fbc72025756))
* update MetaMask extension to v10.29.0 ([#312](https://github.com/ChainSafe/dappeteer/issues/312)) ([b79ab4c](https://github.com/ChainSafe/dappeteer/commit/b79ab4c74fab87747933d8f428624dcbffc3dd19))


### Bug Fixes

* inaccessible under scuttling mode ([#308](https://github.com/ChainSafe/dappeteer/issues/308)) ([a41e6dd](https://github.com/ChainSafe/dappeteer/commit/a41e6dd1c7be42273173a1dc1869819841f44c6d))
* update minimum `playwright` peerDependencies ([#304](https://github.com/ChainSafe/dappeteer/issues/304)) ([90f45e0](https://github.com/ChainSafe/dappeteer/commit/90f45e0921ca9544197d24aa469f186417802fd8))

## [5.0.1](https://github.com/ChainSafe/dappeteer/compare/v5.0.0...v5.0.1) (2023-02-22)


### Bug Fixes

* `peerDependencies` for `puppeteer` ([#288](https://github.com/ChainSafe/dappeteer/issues/288)) ([a5acd5c](https://github.com/ChainSafe/dappeteer/commit/a5acd5cfb8cd1b98bb93c50a102b3d3d00645bde))

## [5.0.0](https://github.com/ChainSafe/dappeteer/compare/v4.2.0...v5.0.0) (2023-02-14)


### ⚠ BREAKING CHANGES

* deprecate `browser` param ([#282](https://github.com/ChainSafe/dappeteer/issues/282))
* change default `headless` from `false` to `true` ([#283](https://github.com/ChainSafe/dappeteer/issues/283))
* Deprecate `snap_confirm` and implement `snap_dialog` ([#277](https://github.com/ChainSafe/dappeteer/issues/277))
* update puppeteer to version 19 ([#276](https://github.com/ChainSafe/dappeteer/issues/276))

### Features

* create account method ([#253](https://github.com/ChainSafe/dappeteer/issues/253)) ([ec7e492](https://github.com/ChainSafe/dappeteer/commit/ec7e4925ea53cee2b78d8709eacee0439bfc60ba))
* Deprecate `snap_confirm` and implement `snap_dialog` ([#277](https://github.com/ChainSafe/dappeteer/issues/277)) ([23a0121](https://github.com/ChainSafe/dappeteer/commit/23a0121143172a3789dcca7e651d5375c81695a3))
* improved DX ([#258](https://github.com/ChainSafe/dappeteer/issues/258)) ([a20d0e1](https://github.com/ChainSafe/dappeteer/commit/a20d0e15b56b74cdfc6c5e24aa4f522663f00f1f))
* support MetamaMask v10.25.X ([#281](https://github.com/ChainSafe/dappeteer/issues/281)) ([27156f7](https://github.com/ChainSafe/dappeteer/commit/27156f731e4f4ef170f03a3f50e984ab0a715a1c))
* upgrade metamask version to 24 ([#264](https://github.com/ChainSafe/dappeteer/issues/264)) ([ee4a513](https://github.com/ChainSafe/dappeteer/commit/ee4a5136250a4b64d8045233227b9926cb203e75))


### Bug Fixes

* `peerDependenciesMeta` typo ([#271](https://github.com/ChainSafe/dappeteer/issues/271)) ([61978c2](https://github.com/ChainSafe/dappeteer/commit/61978c2c4d2c76af3041fc6d1aec36e47f96b4df))
* bootstrap launching with `userDataDir` ([#259](https://github.com/ChainSafe/dappeteer/issues/259)) ([5ea28fe](https://github.com/ChainSafe/dappeteer/commit/5ea28fefc21e609b9f64d3303702b2ff42da025f))
* change default `headless` from `false` to `true` ([#283](https://github.com/ChainSafe/dappeteer/issues/283)) ([1fb43bd](https://github.com/ChainSafe/dappeteer/commit/1fb43bd14109d8c00bb9214f67811a5374192616))
* missing files in released package ([#265](https://github.com/ChainSafe/dappeteer/issues/265)) ([58d01f2](https://github.com/ChainSafe/dappeteer/commit/58d01f2869bbff1f3842a5295a44320144e3cbb5))
* typos ([0f365a2](https://github.com/ChainSafe/dappeteer/commit/0f365a29224db27de974d81a64f4e27ff55ca107))


### Miscellaneous

* deprecate `browser` param ([#282](https://github.com/ChainSafe/dappeteer/issues/282)) ([a11e1ac](https://github.com/ChainSafe/dappeteer/commit/a11e1ac9048ad3b2647e6ab341fe83f03cd5423e))
* update puppeteer to version 19 ([#276](https://github.com/ChainSafe/dappeteer/issues/276)) ([2d66fba](https://github.com/ChainSafe/dappeteer/commit/2d66fbaa1a17a39ceef82feed684ab70e278bd72))

## [4.2.0](https://github.com/ChainSafe/dappeteer/compare/v4.1.1...v4.2.0) (2023-01-26)


### Features

* add test for initSnapEnv method ([#252](https://github.com/ChainSafe/dappeteer/issues/252)) ([970854d](https://github.com/ChainSafe/dappeteer/commit/970854d812806e50df7edc2ef529ab20fd13f782))
* speedup initializing MetaMask ([#238](https://github.com/ChainSafe/dappeteer/issues/238)) ([e32457f](https://github.com/ChainSafe/dappeteer/commit/e32457f3017a5ab053ecea83685a291a5bf25bfd))


### Bug Fixes

* preserve comments in compiled files ([#246](https://github.com/ChainSafe/dappeteer/issues/246)) ([440112a](https://github.com/ChainSafe/dappeteer/commit/440112a7ab987c7c73fe94d14678fb406c8d2ea9))

## [4.1.1](https://github.com/ChainSafe/dappeteer/compare/v4.1.0...v4.1.1) (2023-01-17)


### Bug Fixes

* new headless flag for playwright ([#247](https://github.com/ChainSafe/dappeteer/issues/247)) ([39b7e00](https://github.com/ChainSafe/dappeteer/commit/39b7e00253164e6e33ef4505941af23443026b38))

## [4.1.0](https://github.com/ChainSafe/dappeteer/compare/v4.0.2...v4.1.0) (2023-01-16)


### Features

* set default headless mode ([#239](https://github.com/ChainSafe/dappeteer/issues/239)) ([9fcb540](https://github.com/ChainSafe/dappeteer/commit/9fcb54055cc73d9e7d31954d58332b2719819815))


### Bug Fixes

* args overwrite ([#240](https://github.com/ChainSafe/dappeteer/issues/240)) ([0a8d442](https://github.com/ChainSafe/dappeteer/commit/0a8d44237a06d86f5e7f76473ad75dda6aeb224f))
* explicitly set the default metamask interface language [#212](https://github.com/ChainSafe/dappeteer/issues/212) ([#241](https://github.com/ChainSafe/dappeteer/issues/241)) ([c148a5c](https://github.com/ChainSafe/dappeteer/commit/c148a5c8e753d5741d89a6cfdd1750aa082a9b45))
* increase timeout ([#235](https://github.com/ChainSafe/dappeteer/issues/235)) ([34852cb](https://github.com/ChainSafe/dappeteer/commit/34852cbec1c5ec0415e4071e5d7f508d09b656cf))


### Miscellaneous

* refactor to remove braking change ([#242](https://github.com/ChainSafe/dappeteer/issues/242)) ([6434c83](https://github.com/ChainSafe/dappeteer/commit/6434c8304d390e591a27692b5a84061115781111))
* test headless version ([#237](https://github.com/ChainSafe/dappeteer/issues/237)) ([18c8232](https://github.com/ChainSafe/dappeteer/commit/18c823210e19f2dacbae0d75a02bc383bab89643))

## [4.0.2](https://github.com/ChainSafe/dappeteer/compare/v4.0.1...v4.0.2) (2022-12-15)


### Bug Fixes

* dappeteer dependency ([#229](https://github.com/ChainSafe/dappeteer/issues/229)) ([#230](https://github.com/ChainSafe/dappeteer/issues/230)) ([2b6c213](https://github.com/ChainSafe/dappeteer/commit/2b6c2136701df55a7cb27528c7c4428553adb7a1))

## [4.0.1](https://github.com/ChainSafe/dappeteer/compare/v4.0.0...v4.0.1) (2022-12-15)


### Bug Fixes

* viewport size, timeouts ([#226](https://github.com/ChainSafe/dappeteer/issues/226)) ([cb6abfc](https://github.com/ChainSafe/dappeteer/commit/cb6abfc4bf751addd2e3f1746db3c4183f495c10))

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
