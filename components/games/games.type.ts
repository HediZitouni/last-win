export type GameStatus = 'waiting' | 'started';

export interface Player {
	userId: string;
	name: string;
	score: number;
	credit: number;
	isLast?: boolean;
}

export interface Game {
	id: string;
	name: string;
	code: string;
	createdBy: string;
	createdAt: number;
	status: GameStatus;
	players: Player[];
}
