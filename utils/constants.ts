const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

const API_ADRESS = process.env.EXPO_PUBLIC_API_URL || 'https://otrom.fr/lastwin/api/';

const storeVersion = '0.0.1';
export { HTTP_METHODS, API_ADRESS, storeVersion };
