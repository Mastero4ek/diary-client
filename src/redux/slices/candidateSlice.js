import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AuthService from '@/services/AuthService'
import UserService from '@/services/UserService'
import KeysService from '@/services/KeysService'
import { resError } from '@/helpers/functions'
import $api from '@/http'
import Cookies from 'js-cookie'

export const userDefault = {
	name: '',
	last_name: '',
	email: '',
	cover: '',
	phone: null,
	is_activated: false,
	change_password: false,
	level: { name: 'hamster', value: 0 }, // level зарабатывает за турниры и вызовы
	source: 'self',
	keys: [
		{ id: 0, name: 'Bybit', api: '', secret: '' },
		{ id: 1, name: 'Mexc', api: '', secret: '' },
		{ id: 2, name: 'Okx', api: '', secret: '' },
	],
}

const updateUser = (state, action) => {
	if (action?.payload) {
		const {
			name,
			last_name,
			email,
			cover,
			source,
			is_activated,
			phone,
			change_password,
			updated_at,
			keys,
			level,
		} = action?.payload

		state.user = {
			...state.user,
			name,
			last_name,
			email,
			source,
			cover,
			is_activated,
			phone,
			change_password,
			keys,
			level,
			updated_at,
		}
	}
}

const handleTokens = response => {
	if (!response?.data) {
		console.error('No data in response:', response)
		return null
	}

	// Handle both direct user data and nested user data
	const userData = response.data.user || response.data

	// Extract tokens, handling both nested and direct token properties
	const tokens = {
		access_token:
			response.data.tokens?.access_token || response.data.access_token,
		refresh_token:
			response.data.tokens?.refresh_token || response.data.refresh_token,
	}

	// Only require user data to be present
	if (!userData) {
		console.error('Invalid response format: missing user data')
		return null
	}

	return {
		user: userData,
		tokens: tokens,
	}
}

export const checkAuth = createAsyncThunk(
	'user/check-auth',
	async (_, { rejectWithValue }) => {
		try {
			const response = await $api.get('/refresh')
			const processedData = handleTokens(response)

			if (!processedData?.user) {
				throw new Error('No user data in response')
			}

			// Set cookies for tokens if they exist in the response
			if (processedData.tokens?.access_token) {
				Cookies.set('access_token', processedData.tokens.access_token, {
					expires: 1 / 48, // 30 minutes
					secure: true,
					sameSite: 'Lax',
					path: '/',
				})
			}

			if (processedData.tokens?.refresh_token) {
				Cookies.set('refresh_token', processedData.tokens.refresh_token, {
					expires: 30,
					secure: true,
					sameSite: 'Lax',
					path: '/',
				})
			}

			return processedData
		} catch (e) {
			console.error('checkAuth error:', e)
			// If unauthorized, return null instead of throwing
			if (e?.response?.status === 401 || e?.message === 'UNAUTHORIZED') {
				// Clear tokens on unauthorized
				Cookies.remove('access_token')
				Cookies.remove('refresh_token')
				return null
			}
			return rejectWithValue(resError(e))
		}
	}
)

export const signUp = createAsyncThunk(
	'user/sign-up',
	async (
		{ name, email, password, confirm_password, agreement },
		{ rejectWithValue }
	) => {
		try {
			const response = await AuthService.signUp(
				name,
				email,
				password,
				confirm_password,
				agreement
			)

			const result = handleTokens(response)
			if (!result) {
				throw new Error('Invalid response format: missing required data')
			}

			return result
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const signIn = createAsyncThunk(
	'user/sign-in',
	async ({ email, password, language }, { rejectWithValue }) => {
		try {
			const response = await AuthService.signIn(email, password, language)

			return handleTokens(response)
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const logout = createAsyncThunk(
	'user/logout',
	async (_, { rejectWithValue }) => {
		try {
			await AuthService.logout()
			// Clear cookies
			Cookies.remove('access_token')
			Cookies.remove('refresh_token')
			return null
		} catch (e) {
			console.error('Logout error:', e)
			// Still clear cookies even if the server request fails
			Cookies.remove('access_token')
			Cookies.remove('refresh_token')
			return rejectWithValue(resError(e))
		}
	}
)

export const editUser = createAsyncThunk(
	'user/edit-user',
	async (
		{ name, last_name, email, password, phone, cover },
		{ rejectWithValue }
	) => {
		try {
			const response = await UserService.editUser(
				name,
				last_name,
				email,
				password,
				phone,
				cover
			)

			return response?.data?.user
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const removeCover = createAsyncThunk(
	'user/remove-cover',
	async ({ filename }, { rejectWithValue }) => {
		try {
			const response = await UserService.removeCover(filename)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const removeUser = createAsyncThunk(
	'user/remove-user',
	async ({ current_email, fill_email }, { rejectWithValue }) => {
		try {
			const response = await UserService.removeUser(current_email, fill_email)

			return response?.data
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

export const updateKeys = createAsyncThunk(
	'user/create-keys',
	async ({ exchange, api, secret }, { rejectWithValue }) => {
		try {
			const response = await KeysService.updateKeys(exchange, api, secret)

			return response?.data?.keys
		} catch (e) {
			return rejectWithValue(resError(e))
		}
	}
)

const initialState = {
	user: userDefault,
	changeUser: userDefault,
	isAuth: false,
	serverStatus: 'idle',
	errorMessage: '',
	errorArray: null,
}

const candidateSlice = createSlice({
	name: 'candidate',
	initialState,
	reducers: {
		setPhone(state, action) {
			state.changeUser.phone = action.payload
		},
		setUser(state, action) {
			state.user = action.payload
		},
		setChangeUser(state, action) {
			state.changeUser = action.payload
		},
		setErrorMessage(state, action) {
			state.errorMessage = action.payload
		},
		setErrorArray(state, action) {
			state.errorArray = action.payload
		},
		setIsAuth(state, action) {
			state.isAuth = action.payload
		},
		setServerStatus(state, action) {
			state.serverStatus = action.payload
		},
		clearUser() {
			return initialState
		},
	},
	extraReducers: builder => {
		builder
			// Sign Up
			.addCase(signUp.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = ''
				state.errorArray = null
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.serverStatus = 'succeeded'
				// Don't set isAuth true yet since user needs to activate account
				state.isAuth = false
				if (action.payload?.user) {
					updateUser(state, { payload: action.payload.user })
				}
				if (action.payload?.tokens) {
					state.tokens = action.payload.tokens
				}
				state.errorMessage = ''
				state.errorArray = null
			})
			.addCase(signUp.rejected, (state, action) => {
				state.serverStatus = 'failed'
				state.errorMessage = action.payload?.message || 'Signup failed'
				state.errorArray = action.payload?.errors || null
			})

			// sign in
			.addCase(signIn.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
				state.errorArray = null
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.serverStatus = 'success'
				state.errorMessage = null
				state.errorArray = null

				if (action.payload?.user) {
					// Update user data the same way as in signUp
					state.user = {
						...userDefault, // Ensure all fields are present
						...action.payload.user, // Override with received data
					}
					state.changeUser = { ...state.user }
					// Only set isAuth if user is activated
					state.isAuth = action.payload.user.is_activated === true

					// Store tokens
					if (action.payload.tokens) {
						state.tokens = action.payload.tokens
					}
				}
			})
			.addCase(signIn.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.errorArray = action?.payload?.errors
				state.serverStatus = 'error'
			})

			// check auth
			.addCase(checkAuth.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
				state.errorArray = null
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				if (action.payload?.user) {
					// Update auth state - only set to true if user is activated
					state.isAuth = action.payload.user.is_activated === true
					state.errorMessage = null
					state.errorArray = null

					// Update user data
					state.user = {
						...userDefault, // Ensure all fields are present
						...action.payload.user, // Override with received data
					}
					state.changeUser = { ...state.user }

					// Store tokens
					if (action.payload.tokens) {
						state.tokens = action.payload.tokens

						// Update cookies with proper options
						if (action.payload.tokens.access_token) {
							Cookies.set('access_token', action.payload.tokens.access_token, {
								expires: 1 / 48, // 30 minutes
								secure: true,
								sameSite: 'Lax',
								path: '/',
							})
						}
						if (action.payload.tokens.refresh_token) {
							Cookies.set(
								'refresh_token',
								action.payload.tokens.refresh_token,
								{
									expires: 30,
									secure: true,
									sameSite: 'Lax',
									path: '/',
								}
							)
						}
					}
				} else {
					// Handle unauthorized or missing user data case
					state.isAuth = false
					state.user = userDefault
					state.changeUser = userDefault
					state.tokens = null
					Cookies.remove('access_token')
					Cookies.remove('refresh_token')
				}

				state.serverStatus = 'success'
			})
			.addCase(checkAuth.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.errorArray = action?.payload?.errors
				state.serverStatus = 'error'
				state.isAuth = false
				state.user = userDefault
				state.changeUser = userDefault
				state.tokens = null
				Cookies.remove('access_token')
				Cookies.remove('refresh_token')
			})

			// logout
			.addCase(logout.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
				state.errorArray = null
			})
			.addCase(logout.fulfilled, state => {
				state.serverStatus = 'success'
				state.user = userDefault
				state.changeUser = userDefault
				state.isAuth = false
				state.errorMessage = null
				state.errorArray = null
				state.tokens = null
			})
			.addCase(logout.rejected, (state, action) => {
				// Even if the server request fails, we still want to log out the user locally
				state.serverStatus = 'success'
				state.user = userDefault
				state.changeUser = userDefault
				state.isAuth = false
				state.errorMessage = null
				state.errorArray = null
				state.tokens = null
			})

			// edit user
			.addCase(editUser.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
				state.errorArray = null
			})
			.addCase(editUser.fulfilled, (state, action) => {
				state.errorMessage = null
				state.errorArray = null
				state.serverStatus = 'success'
				updateUser(state, action)
				state.changeUser = state.user
			})
			.addCase(editUser.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.errorArray = action?.payload?.errors
				state.serverStatus = 'error'
			})

			// remove cover
			.addCase(removeCover.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(removeCover.fulfilled, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'success'
				state.user.cover = null
				state.changeUser.cover = null
			})
			.addCase(removeCover.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.serverStatus = 'error'
			})

			// remove user
			.addCase(removeUser.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(removeUser.fulfilled, (state, action) => {
				state.user = userDefault
				state.changeUser = userDefault
				state.errorMessage = null
				state.errorArray = null
				state.isAuth = false
				state.serverStatus = 'success'
			})
			.addCase(removeUser.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.errorArray = action?.payload?.errors
				state.serverStatus = 'error'
			})

			// create keys
			.addCase(updateKeys.pending, state => {
				state.serverStatus = 'loading'
				state.errorMessage = null
			})
			.addCase(updateKeys.fulfilled, (state, action) => {
				state.user = { ...state.user, keys: action.payload }
				state.changeUser = { ...state.changeUser, keys: action.payload }
				state.errorMessage = null
				state.errorArray = null
				state.serverStatus = 'success'
			})
			.addCase(updateKeys.rejected, (state, action) => {
				state.errorMessage = action?.payload?.message
				state.errorArray = action?.payload?.errors
				state.serverStatus = 'error'
			})
	},
})

export const {
	setUser,
	setChangeUser,
	setErrorMessage,
	setErrorArray,
	setIsAuth,
	setServerStatus,
	setPhone,
} = candidateSlice.actions

export default candidateSlice.reducer
