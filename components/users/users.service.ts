import { callApi } from "../../utils/api";
import { HTTP_METHODS } from "../../utils/constants";
import { User } from "./users.type";
import { __retrieveDeviceId, __retrieveUserId, __storeDeviceId } from "./users.store";
import { UserData } from "../user-input/user-input.type";

async function getUsers(gameId?: string): Promise<User[]> {
  const params: string[][] = gameId ? [["gameId", gameId]] : [];
  const response = await callApi(HTTP_METHODS.GET, "users", undefined, params.length ? params : undefined);
  const users: User[] = await response.json();
  return users;
}

async function setLast(id: string, gameId: string) {
  await callApi(HTTP_METHODS.PUT, "last", { id, gameId });
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

async function getUserById(id: string, gameId?: string): Promise<User> {
  const params: string[][] = [["id", id]];
  if (gameId) params.push(["gameId", gameId]);
  const response = await callApi(HTTP_METHODS.GET, "user", undefined, params);
  const user: User = await response.json();
  return user;
}

export { getUsers, setLast, getOrCreateUser, updateUser, getUserById };
