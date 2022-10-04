import { callApi } from '../../utils/api';
import { HTTP_METHODS } from '../../utils/constants';
import { __retrieveUserId } from '../users/users.store';

export async function getIdGameByHashtag(hashtag: string): Promise<string> {
	const response = await callApi(HTTP_METHODS.GET, 'id-game', undefined, [['hashtag', hashtag]]);
	const { idGame } = response.status !== 204 ? await response.json() : '';
	return idGame;
}

export async function joinGame(idGame: string): Promise<void> {
	const idUser = await __retrieveUserId();
	await callApi(HTTP_METHODS.PATCH, 'join-game', { idGame, idUser });
}
