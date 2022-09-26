import { User } from '../users/users.type';

export interface Game {
	id: string;
	hashtag: string;
	name: string;
	credits: number;
	time: number; // minutes
	blind: boolean;
	maxPlayers: number; // To avoid bots
	idOwner: string;
	users?: UserReady[];
}

export interface GameInput {
	name?: string;
	credits?: string;
	time?: string;
	blind?: boolean;
	maxPlayers?: string;
	idOwner?: string;
}

interface UserReady {
	idUser: string;
	ready: boolean;
}

export const gamesMock: Game[] = [
	{
		id: '1',
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		idOwner: '1',
		users: [],
	},
	{
		id: '2',
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		idOwner: '1',
		users: [],
	},
	{
		id: '3',
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		idOwner: '1',
		users: [],
	},
	{
		id: '4',
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		idOwner: '1',
		users: [],
	},
	{
		id: '5',
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		idOwner: '1',
		users: [],
	},
	{
		id: '6',
		hashtag: '#123',
		name: 'partie pour cevennes',
		credits: 5,
		time: 5,
		blind: true,
		maxPlayers: 5,
		idOwner: '1',
		users: [],
	},
];
