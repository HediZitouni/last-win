import { callApi } from "../../utils/api";
import { HTTP_METHODS } from "../../utils/constants";
import { User } from "./users.type";

export async function getOrCreateUser(deviceId: string): Promise<User> {
	const response = await callApi(HTTP_METHODS.POST, "users", { deviceId });
	const user: User = await response.json();
	return user;
}
