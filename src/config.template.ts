import { Config } from "./config-definition";
import { ApiToken } from "./dto/oauth";

// run `pwsh /tools/Set-BootstrappedSonosApiToken.ps1` to bootstrap a API token
const bootstrappedSonosApiToken: ApiToken = require("./bootstrappedSonosApiToken.json");

const config: Config = {
  sonosClientId: "<your sonos client id here>",
  sonosClientSecret: "<your sonos client secret here>",
  sensorPollingRateMilliseconds: 300,
  bootstrappedSonosApiToken: bootstrappedSonosApiToken,
};

export default config;
