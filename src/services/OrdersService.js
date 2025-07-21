import $api from '../http';

export default class OrdersService {
	static async getBybitOrdersPnl(
		exchange,
		sort,
		search,
		page,
		limit,
		start_time,
		end_time
	) {
		return $api.post(`/bybit-orders-pnl`, {
			exchange,
			sort,
			search,
			page,
			limit,
			start_time,
			end_time,
		})
	}

	static async getBybitSavedOrders(
		sort,
		search,
		page,
		limit,
		start_time,
		end_time,
		exchange
	) {
		return $api.post(`/bybit-saved-orders`, {
			sort,
			search,
			page,
			limit,
			start_time,
			end_time,
			exchange,
		})
	}

	static async getBybitTickers(exchange) {
		return $api.post(`/bybit-tickers`, { exchange })
	}

	static async getBybitWallet(exchange, start_time, end_time) {
		return $api.post(`/bybit-wallet`, { exchange, start_time, end_time })
	}

	static async getProfitByDay(exchange, start_time, end_time) {
		return $api.post(`/bybit-profit-by-day`, { exchange, start_time, end_time })
	}

	static async savedOrder(order, exchange) {
		return $api.post(`/saved-order`, { order, exchange })
	}

	static async removedOrder(order, exchange, start_time, end_time) {
		return $api.post(`/removed-order`, {
			order,
			exchange,
			start_time,
			end_time,
		})
	}
}
