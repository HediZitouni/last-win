import { __retrieveDeviceId, __retrieveUserId, __storeDeviceId, __storeUserId } from '../users/users.store';
import { getUniqueId } from 'react-native-device-info';
import { v4 as uuidv4 } from 'uuid';
import { getOrCreateUser, getUserById } from '../users/users.service';

async function setupUser() {
	let [userId, deviceId] = await Promise.all([__retrieveUserId(), __retrieveDeviceId()]);
	if (!deviceId) {
		deviceId = await getOrCreateDeviceId();
		await __storeDeviceId(deviceId);
	}
	if (!userId) {
		userId = (await getOrCreateUser(deviceId)).id;
		await __storeUserId(userId);
	}
	const user = await getUserById(userId);
	return user;
}

async function getOrCreateDeviceId() {
	let id = await __retrieveDeviceId();
	if (!id) {
		// For ios, android and windows
		id = await getUniqueId();
		if (id !== 'unkown') {
			// For web or other device
			id = uuidv4();
		}
		await __storeDeviceId(id);
	}
	return id;
}
export { setupUser, getOrCreateDeviceId };
