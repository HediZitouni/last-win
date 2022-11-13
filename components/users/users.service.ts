import { callApi } from "../../utils/api";
import { HTTP_METHODS } from "../../utils/constants";
import { User } from "./users.type";
import { __retrieveDeviceId, __retrieveUserId, __storeDeviceId } from "./users.store";
import { UserData } from "../user-input/user-input.type";

async function getUsers(idGame: string): Promise<User[]> {
  const response = await callApi(HTTP_METHODS.GET, "users", undefined, [["idGame", idGame]]);
  const users: User[] = await response.json();
  return users;
}

async function setLast(idGame: string, idUser: string) {
  await callApi(HTTP_METHODS.PUT, "last", { idGame, idUser });
}

async function getOrCreateUser(deviceId: string): Promise<User> {
  const response = await callApi(HTTP_METHODS.POST, "users", { deviceId });
  const user: User = await response.json();
  return user;
}

async function updateUser(userData: UserData): Promise<User> {
  const id = await __retrieveUserId();
  const response = await callApi(HTTP_METHODS.PUT, "users", { id, ...userData });
  const updatedUser: User = await response.json();
  return updatedUser;
}

async function getUserById(idUser: string): Promise<User> {
  const response = await callApi(HTTP_METHODS.GET, "user", undefined, [["idUser", idUser]]);
  const user: User = await response.json();
  return user;
}

export async function setUserReady(idUser: string, idGame: string) {
  await callApi(HTTP_METHODS.PATCH, "user-ready", { idUser, idGame });
}

export { getUsers, setLast, getOrCreateUser, updateUser, getUserById };
