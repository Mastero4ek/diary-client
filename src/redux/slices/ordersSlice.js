import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import OrdersService from '@/services/OrdersService'
import { resError } from '@/helpers/functions'

export const getBybitOrdersPnl = createAsyncThunk(
	'get-order-pnl',
	async (
		{ email, sort, search, page, limit, start_time, end_time },
		{ rejectWithValue }
	) => {
		try {
			const response = await OrdersService.getBybitOrdersPnl(
				email,
				sort,
				search,
				page,
				limit,
				start_time,
				end_time
			)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

const initialState = {
	order: null,
	orders: [],
	bookmarks: [],
	page: 1,
	sort: { type: 'closed_time', value: 'desc' }, // по убыванию
	totalProfit: 0,
	totalLoss: 0,
	totalPages: 0,
	serverStatus: '',
	errorMessage: null,
}

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		setOrder(state, action) {
			state.order = action.payload
		},
		setOrders(state, action) {
			state.orders = action.payload
		},
		setBookmarks(state, action) {
			state.bookmarks = action.payload
		},
		setPage(state, action) {
			state.page = action.payload
		},
		setSort(state, action) {
			state.sort = action.payload
		},
		setTotalPages(state, action) {
			state.totalPages = action.payload
		},
		clearOrders(state) {
			state.order = null
			state.orders = []
			state.bookmarks = []
			state.sort = { type: 'closed_time', value: 'desc' } // по убыванию
			state.totalProfit = 0
			state.totalLoss = 0
			state.totalPages = 0
			state.serverStatus = ''
			state.errorMessage = null
		},
	},
	extraReducers: builder => {
		builder
			//get-orders-pnl
			.addCase(getBybitOrdersPnl.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(getBybitOrdersPnl.fulfilled, (state, action) => {
				state.serverStatus = 'success'
				state.errorMessage = action.payload.message || null
				if (!action.payload.message) {
					state.totalLoss = action.payload.total_loss
					state.totalProfit = action.payload.total_profit
					state.orders = action.payload.orders
					state.bookmarks = action.payload.bookmarks
					state.totalPages = action.payload.total_pages
				}
			})
			.addCase(getBybitOrdersPnl.rejected, (state, action) => {
				state.errorMessage =
					action?.payload?.message || 'An error occurred while fetching orders'
				state.serverStatus = 'error'
				state.orders = []
				state.bookmarks = []
				state.totalPages = 0
				state.totalProfit = 0
				state.totalLoss = 0
			})
	},
})

export const {
	setOrders,
	setOrder,
	setPage,
	setSort,
	setTotalPages,
	clearOrders,
} = ordersSlice.actions

export default ordersSlice.reducer
