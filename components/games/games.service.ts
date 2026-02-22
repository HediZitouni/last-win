import { callApi } from '../../utils/api';
import { HTTP_METHODS } from '../../utils/constants';
import { Game } from './games.type';

export async function getGames(): Promise<Game[]> {
	const response = await callApi(HTTP_METHODS.GET, 'games');
	const games: Game[] = await response.json();
	return games;
}

export async function getGameByIdApi(gameId: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.GET, `games/${gameId}`);
	const game: Game = await response.json();
	return game;
}

export async function createGameApi(name: string, createdBy: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.POST, 'games', { name, createdBy });
	const game: Game = await response.json();
	return game;
}

export async function joinGameApi(gameId: string, userId: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.PUT, `games/${gameId}/join`, { userId });
	const game: Game = await response.json();
	return game;
}

export async function startGameApi(gameId: string, userId: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.PUT, `games/${gameId}/start`, { userId });
	const game: Game = await response.json();
	return game;
}
