export type GameStatus = 'waiting' | 'started';

export interface GameSettings {
	maxPlayers: number;
	maxCredits: number;
	timeLimitMinutes: number | null;
	showOtherCredits: boolean;
	showOtherScores: boolean;
	showOtherIsLast: boolean;
}

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
	settings: GameSettings;
	configured: boolean;
	startedAt: number | null;
}
