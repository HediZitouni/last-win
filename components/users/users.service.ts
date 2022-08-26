import { callApi } from "../../utils/api";
import { HTTP_METHODS } from "../../utils/constants";
import { User } from "./users.type";
import { __retrieveDeviceId, __retrieveUserId, __storeDeviceId } from "./users.store";
import { UserData } from "../user-input/user-input.type";

async function getUsers(): Promise<User[]> {
  const response = await callApi(HTTP_METHODS.GET, "users");
  const users: User[] = await response.json();
  return users;
}

async function setLast(id: string) {
  await callApi(HTTP_METHODS.PUT, "last", { id });
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

async function getUserById(id: string): Promise<User> {
  const response = await callApi(HTTP_METHODS.GET, "user", undefined, [["id", id]]);
  const user: User = await response.json();
  return user;
}

export { getUsers, setLast, getOrCreateUser, updateUser, getUserById };
