import { Households, Household, Groups, Player } from "./dto/sonos-response";
import { HttpApiClient } from "./http-api-client";

export class SonosClient {
  private readonly httpClient: HttpApiClient;

  constructor(httpClient: HttpApiClient) {
    this.httpClient = httpClient;
  }

  public getHouseholds(): Promise<Household[]> {
    return this.httpClient
      .get<Households>("households")
      .then((res) => res.households);
  }

  public getPlayers(householdId: string): Promise<Player[]> {
    return this.httpClient
      .get<Groups>(`households/${householdId}/groups`)
      .then((res) => res.players);
  }

  public async getPlayer(
    householdId: string,
    playerName: string
  ): Promise<Player> {
    const players = await this.getPlayers(householdId);

    return players.filter((p) => p.name === playerName)[0];
  }

  public async setPlayerVolume(
    householdId: string,
    playerId: string,
    volume: number
  ): Promise<void> {
    const newVolume = { volume };

    return this.httpClient.post(
      `households/${householdId}/players/${playerId}/playerVolume`,
      newVolume
    );
  }
}
