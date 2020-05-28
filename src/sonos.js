export function Sonos(
  httpClient,
  apiUrl = "https://api.ws.sonos.com/control/api/v1/"
) {
  this.httpClient = httpClient;
  this.apiUrl = apiUrl;
}

Sonos.prototype.getHouseholds = async function getHouseholds() {
  const householdsResponse = await this.httpClient.get(
    this.apiActionUri("households")
  );

  return householdsResponse.households;
};

Sonos.prototype.getGroups = async function getGroups(householdId) {
  const groupsResponse = await this.httpClient.get(
    this.apiActionUri(`households/${householdId}/groups`)
  );

  return groupsResponse.groups;
};

Sonos.prototype.getPlayers = async function getPlayers(householdId) {
  const groupsResponse = await this.httpClient.get(
    this.apiActionUri(`households/${householdId}/groups`)
  );

  return groupsResponse.players;
};

Sonos.prototype.getPlayer = async function getPlayer(householdId, playerName) {
  const players = await this.getPlayers(householdId);

  return players.filter((p) => p.name === playerName);
};

Sonos.prototype.setPlayerVolume = async function setPlayerVolume(
  householdId,
  playerId,
  volume
) {
  const newVolume = { volume };

  const setPlayerVolumeResponse = await this.httpClient.post(
    this.apiActionUri(
      `households/${householdId}/players/${playerId}/playerVolume`
    ),
    newVolume
  );

  return setPlayerVolumeResponse;
};

Sonos.prototype.apiActionUri = function apiActionUri(endpoint) {
  return `${this.apiUrl}${endpoint}`;
};
