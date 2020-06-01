import { ApiToken } from "./dto/oauth";

export interface Config {
  sonosClientId: string;
  sonosClientSecret: string;
  sensorPollingRateMilliseconds: number;
  bootstrappedSonosApiToken: ApiToken;
}
