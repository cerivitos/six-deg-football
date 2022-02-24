import { Team } from './Team';

export interface Player {
  playerId: number;
  playerImg: string;
  playerName: string;
  history: Team[];
}
