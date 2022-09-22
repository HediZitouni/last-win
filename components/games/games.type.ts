import { User } from '../users/users.type';

export interface Game {
	hashtag: string;
	name: string;
	credits: number;
	time: number; // minutes
	blind: boolean;
	maxPlayers: number; // To avoid bots
	users?: UserReady[];
}

interface UserReady {
	user: User;
	ready: boolean;
}

export const gamesMock: Game[] = [
	{
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		users: [],
	},
	{
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		users: [],
	},
	{
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		users: [],
	},
	{
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		users: [],
	},
	{
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		users: [],
	},
	{
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		users: [],
	},
];
