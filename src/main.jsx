import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom'
import { store } from '@/redux/store'

import { App } from '@/components/App'
import { PopupProvider } from '@/components/layouts/PopupLayout/PopupProvider'
import { PopupLayout } from '@/components/layouts/PopupLayout/PopupLayout'

import '@/styles/app.scss'

const rootElem = document.getElementById('root')

if (rootElem) {
	const root = ReactDOM.createRoot(rootElem)

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route
				path='*'
				element={
					<>
						<App />
						<PopupLayout close={true} />
					</>
				}
			/>
		)
	)

	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<PopupProvider>
					<RouterProvider router={router} />
				</PopupProvider>
			</Provider>
		</React.StrictMode>
	)
}
