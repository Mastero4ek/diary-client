import $api from '../http'

export default class OrdersService {
	static async getBybitOrdersPnl(
		email,
		sort,
		search,
		page,
		limit,
		start_time,
		end_time
	) {
		return $api.post(`/bybit-orders-pnl`, {
			email,
			sort,
			search,
			page,
			limit,
			start_time,
			end_time,
		})
	}

	static async getBybitSavedOrders(
		email,
		sort,
		search,
		page,
		limit,
		start_time,
		end_time,
		exchange
	) {
		return $api.post(`/bybit-saved-orders`, {
			email,
			sort,
			search,
			page,
			limit,
			start_time,
			end_time,
			exchange,
		})
	}

	static async getBybitTickers(email) {
		return $api.post(`/bybit-tickers`, { email })
	}

	static async savedOrder(email, order, exchange) {
		return $api.post(`/saved-order`, { email, order, exchange })
	}

	static async removedOrder(email, order, exchange, start_time, end_time) {
		return $api.post(`/removed-order`, {
			email,
			order,
			exchange,
			start_time,
			end_time,
		})
	}
}
