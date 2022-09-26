import { callApi } from '../../utils/api';
import { HTTP_METHODS } from '../../utils/constants';
import { GameInput } from '../games/games.type';
import { __retrieveUserId } from '../users/users.store';

export async function createGame(gameInput: GameInput): Promise<string> {
	const { credits, time, maxPlayers } = gameInput;
	const idOwner = await __retrieveUserId();
	const response = await callApi(HTTP_METHODS.POST, 'games', { ...gameInput, idOwner, credits: +credits, time: +time, maxPlayers: +maxPlayers });
	const { idGame } = await response.json();
	return idGame;
}
