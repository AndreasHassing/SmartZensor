import { ApiToken } from "./dto/oauth";

export class TokenRepository {
  private static readonly SonosApiTokenKey = "sonosApiToken";

  public static setSonosApiToken(apiToken: ApiToken) {
    tizen.keymanager.saveData(
      TokenRepository.SonosApiTokenKey,
      JSON.stringify(apiToken)
    );
  }

  public static getSonosApiToken(): ApiToken {
    try {
      const key = tizen.keymanager.getData({
        name: TokenRepository.SonosApiTokenKey,
      });

      console.debug("Found Sonos API Key in tizen keymanager");

      return JSON.parse(key);
    } catch (ex) {
      console.debug("Didn't find Sonos API Key in tizen keymanager");

      return undefined;
    }
  }
}
