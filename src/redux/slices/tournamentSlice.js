import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import TournamentService from '@/services/TournamentService'
import { resError } from '@/helpers/functions'

export const getTournament = createAsyncThunk(
	'get-tournament',
	async ({ exchange, page, size }, { rejectWithValue }) => {
		try {
			const response = await TournamentService.getTournament(
				exchange,
				page,
				size
			)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const addTournamentUser = createAsyncThunk(
	'add-tournament-user',
	async ({ email, exchange }, { rejectWithValue }) => {
		try {
			const response = await TournamentService.addTournamentUser(
				email,
				exchange
			)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

// TODO: add fake tournament

const initialState = {
	fakeTournament: null,
	tournament: {},
	users: [],
	page: 1,
	size: 5,
	sort: {},
	totalPages: 1,
	serverStatus: '',
	errorMessage: null,
}

const tournamentSlice = createSlice({
	name: 'tournament',
	initialState,
	reducers: {
		setTournament(state, action) {
			state.tournament = action.payload
		},
		setUsers(state, action) {
			state.users = action.payload
		},
		setPage(state, action) {
			state.page = action.payload
		},
		setSize(state, action) {
			state.size = action.payload
		},
		setSort(state, action) {
			state.sort = action.payload
		},
		setTotalPages(state, action) {
			state.totalPages = action.payload
		},
		clearTournaments() {
			return initialState
		},
	},
	extraReducers: builder => {
		builder
			//tournaments
			.addCase(getTournament.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(getTournament.fulfilled, (state, action) => {
				state.errorMessage = action.payload.message || null
				state.serverStatus =
					action.payload.users?.length === 0 ? 'error' : 'success'
				state.tournament = action.payload.tournament
				state.users = action.payload.users
				state.totalPages = action.payload.total
					? Math.ceil(action.payload.total / state.size)
					: state.totalPages
			})
			.addCase(getTournament.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
			})

			//add-tournament-user
			.addCase(addTournamentUser.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(addTournamentUser.fulfilled, (state, action) => {
				state.errorMessage = null
				state.serverStatus = 'success'
				state.tournament = action.payload.tournament
				state.users = action.payload.users
				state.totalPages = action.payload.total
					? Math.ceil(action.payload.total / state.size)
					: state.totalPages
			})
			.addCase(addTournamentUser.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
			})
	},
})

export const {
	setTournament,
	setPage,
	setSize,
	setTotalPages,
	clearTournaments,
} = tournamentSlice.actions

export default tournamentSlice.reducer
