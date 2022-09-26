import { callApi } from '../../utils/api';
import { HTTP_METHODS } from '../../utils/constants';
import { Game } from '../games/games.type';
import { __retrieveUserId } from '../users/users.store';

export async function launchGame(idGame: string) {
	const idOwner = await __retrieveUserId();
	await callApi(HTTP_METHODS.PATCH, 'games', { idGame, idUser: idOwner });
}

export async function getGame(id: string): Promise<Game> {
	const response = await callApi(HTTP_METHODS.GET, 'game', undefined, [['id', id]]);
	const game = response.json();
	return game;
}
