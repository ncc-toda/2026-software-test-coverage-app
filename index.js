import { registerRootComponent } from "expo";

import App from "./App";

// アプリのエントリーポイント。
// registerRootComponent が内部で AppRegistry.registerComponent("main", () => App)
// を呼び出し、Expo Go / ネイティブ双方で正しく起動できるようにする。
registerRootComponent(App);
