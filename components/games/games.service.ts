import { callApi } from '../../utils/api';
import { HTTP_METHODS } from '../../utils/constants';
import { Game, Player } from './games.type';

export async function getMyGames(userId: string): Promise<Game[]> {
	const response = await callApi(HTTP_METHODS.GET, `games?userId=${userId}`);
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

export async function joinGameByCodeApi(code: string, userId: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.PUT, 'games/join', { code, userId });
	const game: Game = await response.json();
	return game;
}

export async function rejoinGameApi(gameId: string, userId: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.PUT, `games/${gameId}/rejoin`, { userId });
	const game: Game = await response.json();
	return game;
}

export async function startGameApi(gameId: string, userId: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.PUT, `games/${gameId}/start`, { userId });
	const game: Game = await response.json();
	return game;
}

export async function updatePlayerNameApi(gameId: string, userId: string, name: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.PUT, `games/${gameId}/player/name`, { userId, name });
	const game: Game = await response.json();
	return game;
}

export async function getPlayersApi(gameId: string): Promise<Player[]> {
	const response = await callApi(HTTP_METHODS.GET, `games/${gameId}/players`);
	const players: Player[] = await response.json();
	return players;
}

export async function getPlayerApi(gameId: string, userId: string): Promise<Player> {
	const response = await callApi(HTTP_METHODS.GET, `games/${gameId}/player?userId=${userId}`);
	const player: Player = await response.json();
	return player;
}

export async function setLastApi(userId: string, gameId: string): Promise<void> {
	await callApi(HTTP_METHODS.PUT, 'last', { userId, gameId });
}
