import { configureStore } from '@reduxjs/toolkit'

import settings from './slices/settingsSlice'
import candidate from './slices/candidateSlice'
import filters from './slices/filtersSlice'
import tournaments from './slices/tournamentSlice'
import orders from './slices/ordersSlice'
import bookmarks from './slices/bookmarksOrdersSlice'
import wallet from './slices/walletSlice'

export const store = configureStore({
	reducer: {
		settings,
		candidate,
		filters,
		tournaments,
		orders,
		bookmarks,
		wallet,
	},
})
