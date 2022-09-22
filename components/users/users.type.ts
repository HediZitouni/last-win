import { Game } from '../games/games.type';

interface User {
	id: string;
	deviceId: string;
	name: string;
	score: number;
	credit: number;
	isLast?: boolean;
}

export const initUser: User = {
	id: '',
	deviceId: '',
	name: '',
	score: 0,
	credit: 0,
	isLast: false,
};
export { User };
