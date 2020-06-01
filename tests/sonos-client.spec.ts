import config from "../src/config";
import { SonosClient } from "../src/sonos-client";
import { HttpApiClient } from "../src/http-api-client";

// Jest fails to find Fetch unless we do this
import "isomorphic-fetch";
global.fetch = fetch;

test("a", async () => {
  const httpClient = new HttpApiClient(
    "https://api.ws.sonos.com/control/api/v1/",
    config.bootstrappedSonosApiToken,
    "https://api.sonos.com/login/v3/oauth/access"
  );

  const client = new SonosClient(httpClient);

  var households = await client.getHouseholds();

  expect(households).toHaveLength(1);
});
