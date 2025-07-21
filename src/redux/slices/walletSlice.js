import { fakeWallet } from '@/helpers/constants'
import { resError } from '@/helpers/functions'
import OrdersService from '@/services/OrdersService'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

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

export const getWalletAndProfit = createAsyncThunk(
	'wallet/get-wallet-and-profit',
	async ({ exchange, start_time, end_time }, { rejectWithValue }) => {
		try {
			const [walletRes, profitRes] = await Promise.all([
				OrdersService.getBybitWallet(exchange, start_time, end_time),
				OrdersService.getProfitByDay(exchange, start_time, end_time),
			])
			return {
				wallet: walletRes?.data,
				profitByDay: profitRes?.data?.items || [],
				message: walletRes?.data?.message || profitRes?.data?.message || null,
			}
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
	profitByDay: [],
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
			//get-wallet-and-profit
			.addCase(getWalletAndProfit.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(getWalletAndProfit.fulfilled, (state, action) => {
				const { wallet, profitByDay, message } = action.payload
				state.wallet.total_balance = wallet.total_balance
				state.wallet.unrealised_pnl = wallet.unrealised_pnl
				state.wallet.total_profit = wallet.total_profit
				state.wallet.total_loss = wallet.total_loss
				state.wallet.wining_trades = wallet.wining_trades
				state.wallet.losing_trades = wallet.losing_trades
				state.wallet.net_profit = +parseFloat(
					wallet.total_profit + wallet.total_loss
				).toFixed(2)
				state.wallet.winrate =
					(state.wallet.wining_trades /
						(state.wallet.wining_trades + state.wallet.losing_trades)) *
						100 || 0
				state.profitByDay = profitByDay
				state.serverStatus = 'success'
				state.errorMessage = message
				state.fakeWallet = null
			})
			.addCase(getWalletAndProfit.rejected, (state, action) => {
				state.fakeWallet = fakeWallet
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
			})
	},
})

export const { setErrorMessage, setServerStatus, clearWallet } =
	walletSlice.actions

export default walletSlice.reducer
