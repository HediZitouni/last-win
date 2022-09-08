import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeVersion } from '../../utils/constants';

export async function __storeUserId(id: string) {
	try {
		await AsyncStorage.setItem('id', id);
	} catch (error) {
		console.log('error during saving userId');
		// Error saving data
	}
}

export async function __retrieveUserId() {
	try {
		return await AsyncStorage.getItem('id');
	} catch (error) {
		console.log('error during retrieving userId');
	}
}

export async function __storeDeviceId(deviceId: string) {
	try {
		await AsyncStorage.setItem('deviceId', deviceId);
	} catch (error) {
		console.log('error during saving deviceId');
		// Error saving data
	}
}

export async function __retrieveDeviceId() {
	try {
		return await AsyncStorage.getItem('deviceId');
	} catch (error) {
		console.log('error during retrieving deviceId');
	}
}

export async function __storeVersion(version: string) {
	try {
		await AsyncStorage.setItem('version', version);
	} catch (error) {
		console.log('error during saving version');
		// Error saving data
	}
}

export async function __retrieveVersion() {
	try {
		return await AsyncStorage.getItem('version');
	} catch (error) {
		console.log('error during retrieving version');
	}
}

export async function __resetStore() {
	try {
		await AsyncStorage.clear();
		await __storeVersion(storeVersion);
	} catch (error) {
		console.log('error during retrieving version');
	}
}
