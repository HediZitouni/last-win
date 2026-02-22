import { __resetStore, __retrieveDeviceId, __retrieveUserId, __retrieveVersion, __storeDeviceId, __storeUserId } from '../users/users.store';
import { getUniqueId } from 'react-native-device-info';
import { v4 as uuidv4 } from 'uuid';
import { getOrCreateUser } from '../users/users.service';
import { storeVersion } from '../../utils/constants';

async function setupUser() {
	const version = await __retrieveVersion();
	if (version !== storeVersion) await __resetStore();

	let [userId, deviceId] = await Promise.all([__retrieveUserId(), __retrieveDeviceId()]);
	if (!deviceId) {
		deviceId = await getOrCreateDeviceId();
		await __storeDeviceId(deviceId);
	}
	if (!userId) {
		const user = await getOrCreateUser(deviceId);
		userId = user.id;
		await __storeUserId(userId);
	}
	return { id: userId, deviceId };
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
