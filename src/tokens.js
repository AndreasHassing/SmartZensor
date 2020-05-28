export function TokenRepository() {}

const sonosApiTokenKey = "sonosApiToken";

TokenRepository.getSonosApiToken = function getSonosApiToken() {
  // I know this ain't pretty, but instead of spending a lot of time
  // on authenticating with Sonos (and making this work generally),
  // I just did that work manually and plotted this guy in here.
  // For future devs, follow the steps in the below link and place
  // the first access token you get, the app will refresh it automatically
  // and place it in persistent secure storage (tizen.keymanager):
  // https://developer.sonos.com/build/direct-control/authorize/
  const bootstrappedSonosAccessToken = {
    access_token: "<snip>",
    token_type: "Bearer",
    expires_in: 86399,
    refresh_token: "<snip>",
    scope: "playback-control-all",
  };

  try {
    const key = tizen.keymanager.getData({
      name: sonosApiTokenKey,
    });

    console.debug("Found Sonos API Key in tizen keymanager");

    return JSON.parse(key);
  } catch (ex) {
    console.debug(
      "Didn't find Sonos API Key in tizen keymanager, falling back to bootstrapped access token"
    );

    return bootstrappedSonosAccessToken;
  }
};

TokenRepository.setSonosApiToken = function setSonosApiToken(apiToken) {
  tizen.keymanager.saveData(sonosApiTokenKey, JSON.stringify(apiToken));
};
