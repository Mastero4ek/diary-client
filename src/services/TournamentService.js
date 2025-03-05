import $api from '../http'

export default class TournamentService {
	static async getTournament(exchange, page, size) {
		return $api.post(`/tournament?page=${page}&size=${size}`, { exchange })
	}

	static async addTournamentUser(email, exchange) {
		return $api.post('/add_tournament_user', { email, exchange })
	}
}
