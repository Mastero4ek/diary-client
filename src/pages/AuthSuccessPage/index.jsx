import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuth } from '@/redux/slices/candidateSlice'
import $api from '@/http'

export const AuthSuccessPage = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(() => {
		const handleAuthSuccess = async () => {
			try {
				// Use our configured $api instance that has proper interceptors and cookie handling
				const response = await $api.get('/refresh')

				if (response.data) {
					// If we have user data, update the store
					dispatch(checkAuth.fulfilled(response.data))
					navigate('/dashboard')
				} else {
					navigate('/auth/error')
				}
			} catch (error) {
				console.error('Auth success error:', error)
				navigate('/auth/error')
			}
		}

		handleAuthSuccess()
	}, [navigate, dispatch])

	return (
		<div>
			<h1>Authenticating...</h1>
		</div>
	)
}
