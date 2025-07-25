import $api from '../http'

export default class UserService {
	static async editUser(name, last_name, email, password, phone, cover) {
		const formData = new FormData()

		if (name) formData.append('name', name)
		if (last_name) formData.append('last_name', last_name)
		if (email) formData.append('email', email)
		if (password) formData.append('password', password)
		if (phone) formData.append('phone', phone)
		if (cover) formData.append('cover', cover)

		return $api.post('/edit-user', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			withCredentials: true,
		})
	}

	static async removeCover(filename) {
		return $api.post(`/remove-cover/${filename}`)
	}

	static async removeUser(current_email, fill_email) {
		return $api.post('/remove-user', { current_email, fill_email })
	}

	static async getUser(id) {
		return $api.get(`/user/${id}`)
	}
}
