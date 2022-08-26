import AsyncStorage from "@react-native-async-storage/async-storage";

export async function __storeUserId(id: string) {
  try {
    await AsyncStorage.setItem("id", id);
  } catch (error) {
    console.log("error during saving userId");
    // Error saving data
  }
}

export async function __retrieveUserId() {
  try {
    return await AsyncStorage.getItem("id");
  } catch (error) {
    console.log("error during retrieving userId");
  }
}

export async function __storeDeviceId(deviceId: string) {
  try {
    await AsyncStorage.setItem("deviceId", deviceId);
  } catch (error) {
    console.log("error during saving deviceId");
    // Error saving data
  }
}

export async function __retrieveDeviceId() {
  try {
    return await AsyncStorage.getItem("deviceId");
  } catch (error) {
    console.log("error during retrieving deviceId");
  }
}
