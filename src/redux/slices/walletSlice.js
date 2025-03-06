import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import OrdersService from '@/services/OrdersService'
import { resError } from '@/helpers/functions'

export const getBybitWallet = createAsyncThunk(
	'get-bybit-wallet',
	async ({ exchange }, { rejectWithValue }) => {
		try {
			const response = await OrdersService.getBybitWallet(exchange)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

const initialState = {
	total_balance: 0,
	unrealised_pnl: 0,
	serverStatus: '',
	errorMessage: null,
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
				state.total_balance = +action.payload.total_balance
				state.unrealised_pnl = +action.payload.unrealised_pnl
				state.serverStatus = 'success'
				state.errorMessage = action.payload.message || null
			})
			.addCase(getBybitWallet.rejected, (state, action) => {
				state.errorMessage =
					action?.payload?.message || 'An error occurred while fetching wallet'
				state.serverStatus = 'error'
			})
	},
})

export const { setErrorMessage, setServerStatus, clearWallet } =
	walletSlice.actions

export default walletSlice.reducer
