import { ApiToken } from "./dto/oauth";

export class HttpApiClient {
  private readonly apiUrl: string;
  private readonly tokenRefreshUrl: string;

  private apiToken: ApiToken;

  constructor(apiUrl: string, apiToken: ApiToken, tokenRefreshUrl: string) {
    this.apiUrl = apiUrl;
    this.apiToken = apiToken;
    this.tokenRefreshUrl = tokenRefreshUrl;
  }

  public get<T>(actionUrl: string): Promise<T> {
    return this.request<T>(actionUrl, "GET");
  }

  public post<T>(actionUrl: string, json: object = {}): Promise<T> {
    return this.request<T>(actionUrl, "POST", json);
  }

  public async refreshToken(
    clientId: string,
    clientSecret: string
  ): Promise<ApiToken> {
    const payload = {
      grant_type: "refresh_token",
      refresh_token: this.apiToken.refresh_token,
    };

    const formEncode = ([key, value]: [string, any]) =>
      encodeURIComponent(key) + "=" + encodeURIComponent(value);

    const formBody = Object.entries(payload).map(formEncode).join("&");

    const basicAuthToken = btoa(`${clientId}:${clientSecret}`);
    const newApiToken: ApiToken = await fetch(this.tokenRefreshUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuthToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    }).then((r) => r.json());

    this.apiToken = newApiToken;

    return newApiToken;
  }

  private async request<T>(
    actionUrl: string,
    method: string,
    json: object = {}
  ): Promise<T> {
    const isObjectEmpty = (obj: object) => Object.entries(obj).length === 0;

    const response = await fetch(`${this.apiUrl}${actionUrl}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiToken.access_token}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: isObjectEmpty(json) ? null : JSON.stringify(json),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to invoke action (${method} ${actionUrl}) on Sonos API: ${await response.text()}`
      );
    }

    const responseJson = await response.json();

    return responseJson;
  }
}
