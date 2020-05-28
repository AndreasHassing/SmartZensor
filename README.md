# Smart Zensor

Double-click <kbd>Home</kbd>, rotate your wrist; volume goes up and down! Leave control-mode by pressing <kbd>Back</kbd>.

See it in action [here (twitter video)](https://twitter.com/AndreasHassing/status/1265571056078725125).

## I want this on my Samsung Watch ⌚!

Ok cool 🍦, follow these steps:

1. Download and install [Tizen Studio](https://developer.tizen.org/ko/development/tizen-studio/download).
1. Create an [integration on Sonos](https://integration.sonos.com/integrations), or make changes in the code to change volume on devices that are not Sonos.
1. Copy `config.template.xml` to `config.xml`, then make changes to the `sonosClientId` and `sonosClientSecret` elements (this can also be done from Tizen Studio).
1. Make changes in [`tokens.js`](./src/tokens.js) (`bootstrappedSonosAccessToken` needs to contain a bootstrapped access token, as I didn't bother implementing a OAuth2 authentication flow on the Gear - or in a [companion app on Android](https://developer.samsung.com/galaxy-watch-develop/creating-your-first-app/web-companion/setup-sdk.html)).
1. Run `npm install` and `npm run build` in the project folder.
1. Load the project in Tizen Studio and run it on your watch.
    - Configure your Watch and Tizen to receive and run your app, by following [these steps](https://developer.samsung.com/galaxy-watch-develop/creating-your-first-app/web.html#target). Don't forget to [configure Tizen to sign your app](https://docs.tizen.org/application/tizen-studio/common-tools/certificate-registration).
1. Configure double-press of the <kbd>Home</kbd> button to open this app.
    - Press the <kbd>Back</kbd> button to stop controlling the volume.

## Can you add feature `x` to "Smart Zensor"?

Feel free to [open an issue against this repository](https://github.com/AndreasHassing/SmartZensor/issues/new) and/or create a pull request. If feature requests are quick and easy to implement, I might add them when I find the time 😊.
