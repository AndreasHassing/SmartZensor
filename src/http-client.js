export function HttpClient(apiToken, tokenRefreshUrl) {
  this.apiToken = apiToken;
  this.tokenRefreshUrl = tokenRefreshUrl;
}

HttpClient.prototype.get = function get(url) {
  return this.request(url, "GET");
};

HttpClient.prototype.post = function post(url, json = {}) {
  return this.request(url, "POST", json);
};

HttpClient.prototype.request = function request(url, method, json = {}) {
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${this.apiToken.access_token}`,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: isEmpty(json) ? null : JSON.stringify(json),
  })
    .then((r) => r.json())
    .catch(console.error);
};

HttpClient.prototype.refreshToken = async function refreshToken(
  clientId,
  secret
) {
  const payload = {
    grant_type: "refresh_token",
    refresh_token: this.apiToken.refresh_token,
  };

  const formEncode = (key) =>
    encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]);
  const formBody = Object.keys(payload).map(formEncode).join("&");

  const basicAuthToken = btoa(`${clientId}:${secret}`);
  const newApiToken = await fetch(this.tokenRefreshUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuthToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formBody,
  })
    .then((r) => r.json())
    .catch(console.error);

  this.apiToken = newApiToken;

  return newApiToken;
};

function isEmpty(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}
