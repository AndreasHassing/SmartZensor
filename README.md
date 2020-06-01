# Smart Zensor

Double-click <kbd>Home</kbd>, rotate your wrist; volume goes up and down! Leave control-mode by pressing <kbd>Back</kbd>.

See it in action [here (twitter video)](https://twitter.com/AndreasHassing/status/1265571056078725125).

## I want this on my Samsung Watch ⌚!

Ok cool 🍦, follow these steps:

### Prerequisites

-   [Node.js](https://nodejs.org/).
-   [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download).
-   Create an [integration on Sonos](https://integration.sonos.com/integrations), or make changes in the code to change volume on devices that are not Sonos.

### Let's go!

1. Clone this repository.
1. Copy [`src/config.template.ts`](./src/config.template.ts) to `src/config.ts`, then make changes to the `sonosClientId` and `sonosClientSecret` properties. Also configure a bootstrapped Sonos API token (use [`Get-SonosApiToken.ps1`](./tools/Get-SonosApiToken.ps1) as a help) in the config.
    - > You may think: "Why do I need to do all this?": I didn't bother implementing a OAuth2 authentication flow on the Gear - or in a [companion app on Android](https://developer.samsung.com/galaxy-watch-develop/creating-your-first-app/web-companion/setup-sdk.html)). Instead, you run the initial access-token generation, and then let the app run it inside your watch for consecutive refreshes. Never do that in the real world! Your server should be creating and refreshing tokens on behalf of your users - do _not_ share your integration secrets with devices that are not completely in your control.
1. Run `npm install` and `npm run build` in the project folder.
1. Load the project in Tizen Studio and run it on your watch.
    - Configure your Watch and Tizen to receive and run your app, by following [these steps](https://developer.samsung.com/galaxy-watch-develop/creating-your-first-app/web.html#target). Don't forget to [configure Tizen to sign your app](https://docs.tizen.org/application/tizen-studio/common-tools/certificate-registration).
    * You can also run `npm run build-dev` to get source maps and easier debugging.
1. [Configure double-press of the <kbd>Home</kbd> button to open this app](https://www.samsung.com/ca/support/mobile-devices/gear-s2-how-can-i-quickly-open-a-favorite-application-on-my-samsung-gear-s2/).
    - Press the <kbd>Back</kbd> button to stop controlling the volume.

## Can you add feature `x` to "Smart Zensor"?

Feel free to [open an issue against this repository](https://github.com/AndreasHassing/SmartZensor/issues/new) and/or create a pull request. If feature requests are quick and easy to implement, I might add them when I find the time 😊.
