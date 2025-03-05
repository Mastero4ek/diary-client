import $api from '../http'

export default class KeysService {
	static async updateKeys(email, exchange, api, secret) {
		return $api.post('/create-keys', { email, exchange, api, secret })
	}
}
