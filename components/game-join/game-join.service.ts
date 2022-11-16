import { callApi } from "../../utils/api";
import { HTTP_METHODS } from "../../utils/constants";
import { __retrieveUserId } from "../users/users.store";

export async function getIdGameByHashtag(hashtag: string, idUser: string): Promise<string> {
  const response = await callApi(HTTP_METHODS.GET, "id-game", undefined, [
    ["hashtag", hashtag],
    ["idUser", idUser],
  ]);
  const { idGame } = response.status !== 204 ? await response.json() : "";
  return idGame;
}

export async function joinGame(idGame: string): Promise<string | undefined> {
  const idUser = await __retrieveUserId();
  const response = await callApi(HTTP_METHODS.PATCH, "join-game", { idGame, idUser });
  const { message } = await response.json();
  return message;
}
