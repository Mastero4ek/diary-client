import $api from '../http'

export default class KeysService {
	static async updateKeys(exchange, api, secret) {
		return $api.post('/update-keys', { exchange, api, secret })
	}
}
