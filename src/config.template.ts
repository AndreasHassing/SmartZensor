import { Config } from "./config-definition";

const config: Config = {
  sonosClientId: "<your sonos client id here>",
  sonosClientSecret: "<your sonos client secret here>",
  sensorPollingRateMilliseconds: 300,
  bootstrappedSonosApiToken: {
    access_token: "<sonos access token here>",
    expires_in: 0,
    refresh_token: "<sonos refresh token here>",
    scope: "<sonos scope here>",
    token_type: "<sonos token type here>",
  },
};

export default config;
