import { fakeWallet } from '@/helpers/constants';
import { resError } from '@/helpers/functions';
import OrdersService from '@/services/OrdersService';
import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

export const getBybitWallet = createAsyncThunk(
	'get-bybit-wallet',
	async ({ exchange, start_time, end_time }, { rejectWithValue }) => {
		try {
			const response = await OrdersService.getBybitWallet(
				exchange,
				start_time,
				end_time
			)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const getProfitByDay = createAsyncThunk(
	'wallet/get-profit-by-day',
	async ({ exchange, start_time, end_time }, { rejectWithValue }) => {
		try {
			const response = await OrdersService.getProfitByDay(
				exchange,
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
	wallet: {
		total_balance: 0,
		unrealised_pnl: 0,
		total_profit: 0,
		total_loss: 0,
		wining_trades: 0,
		losing_trades: 0,
		net_profit: 0,
		winrate: 0,
	},
	fakeWallet: null,
	serverStatus: '',
	errorMessage: null,
	profitByDay: [], // добавлено
}

const walletSlice = createSlice({
	name: 'wallet',
	initialState,
	reducers: {
		setServerStatus(state, action) {
			state.serverStatus = action.payload
		},
		setErrorMessage(state, action) {
			state.errorMessage = action.payload
		},
		clearWallet() {
			return initialState
		},
	},
	extraReducers: builder => {
		builder
			//get-bybit-wallet
			.addCase(getBybitWallet.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(getBybitWallet.fulfilled, (state, action) => {
				state.wallet.total_balance = action.payload.total_balance
				state.wallet.unrealised_pnl = action.payload.unrealised_pnl
				state.wallet.total_profit = action.payload.total_profit
				state.wallet.total_loss = action.payload.total_loss
				state.wallet.wining_trades = action.payload.wining_trades
				state.wallet.losing_trades = action.payload.losing_trades
				state.wallet.net_profit = +parseFloat(
					action.payload.total_profit + action.payload.total_loss
				).toFixed(2)

				state.wallet.winrate =
					(state.wallet.wining_trades /
						(state.wallet.wining_trades + state.wallet.losing_trades)) *
						100 || 0
				state.serverStatus = 'success'
				state.errorMessage = action.payload.message || null
				state.fakeWallet = null
			})
			.addCase(getBybitWallet.rejected, (state, action) => {
				state.fakeWallet = fakeWallet
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
			})
			// profit by day
			.addCase(getProfitByDay.pending, state => {
				state.serverStatus = 'loading'
			})
			.addCase(getProfitByDay.fulfilled, (state, action) => {
				state.profitByDay = action.payload?.items || []
				state.serverStatus = 'success'
			})
			.addCase(getProfitByDay.rejected, (state, action) => {
				state.profitByDay = []
				state.serverStatus = 'error'
			})
	},
})

export const { setErrorMessage, setServerStatus, clearWallet } =
	walletSlice.actions

export default walletSlice.reducer
