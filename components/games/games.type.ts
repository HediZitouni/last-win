export type GameStatus = 'waiting' | 'started';

export interface Game {
	id: string;
	name: string;
	createdBy: string;
	createdAt: number;
	status: GameStatus;
	players: string[];
}
