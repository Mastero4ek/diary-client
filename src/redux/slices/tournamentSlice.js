import { fakeUsers } from '@/helpers/constants'
import { resError } from '@/helpers/functions'
import TournamentService from '@/services/TournamentService'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

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

export const createTournament = createAsyncThunk(
	'create-tournament',
	async (data, { rejectWithValue }) => {
		try {
			const response = await TournamentService.createTournament(data)

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

export const deleteTournament = createAsyncThunk(
	'delete-tournament',
	async (id, { rejectWithValue }) => {
		try {
			const response = await TournamentService.deleteTournament(id)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const removeTournamentUser = createAsyncThunk(
	'remove-tournament-user',
	async ({ tournamentId, userId }, { rejectWithValue }) => {
		try {
			const response = await TournamentService.removeTournamentUser(
				tournamentId,
				userId
			)
			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

const initialState = {
	fakeUsers: null,
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
		setErrorMessage(state, action) {
			state.errorMessage = action.payload
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
				state.fakeUsers = action.payload.users.length === 0 ? fakeUsers : null
				state.users = action.payload.users
				state.totalPages = action.payload.total
					? Math.ceil(action.payload.total / state.size)
					: state.totalPages
			})
			.addCase(getTournament.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
				state.fakeUsers = fakeUsers
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
				state.fakeUsers = action.payload.users.length === 0 ? fakeUsers : null
				state.users = action.payload.users
				state.totalPages = action.payload.total
					? Math.ceil(action.payload.total / state.size)
					: state.totalPages
			})
			.addCase(addTournamentUser.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.fakeUsers = fakeUsers
				state.serverStatus = 'error'
			})

			//create-tournament
			.addCase(createTournament.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(createTournament.fulfilled, (state, action) => {
				state.errorMessage = null
				state.tournament = action.payload.tournament
				state.users = action.payload.users
				state.totalPages = action.payload.total
					? Math.ceil(action.payload.total / state.size)
					: state.totalPages
				state.fakeUsers = action.payload.users.length === 0 ? fakeUsers : null
				state.serverStatus = 'success'
			})
			.addCase(createTournament.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
			})

			//delete-tournament
			.addCase(deleteTournament.fulfilled, (state, action) => {
				state.tournament = {}
				state.users = []
				state.serverStatus = 'success'
				state.errorMessage = null
			})
			.addCase(deleteTournament.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
			})

			//remove-tournament-user
			.addCase(removeTournamentUser.fulfilled, (state, action) => {
				state.serverStatus = 'success'
				state.errorMessage = null
			})
			.addCase(removeTournamentUser.rejected, (state, action) => {
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
	setErrorMessage,
} = tournamentSlice.actions

export default tournamentSlice.reducer
