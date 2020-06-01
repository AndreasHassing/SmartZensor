/**
 * https://developer.sonos.com/reference/control-api/households/
 */
export type Household = {
  id: string;
};

/**
 * https://developer.sonos.com/reference/control-api/groups/groups/#player
 */
export type Player = {
  id: string;
  name: string;
};

/**
 * https://developer.sonos.com/reference/control-api/groups/groups/
 */
export type Groups = {
  players: Player[];
};
