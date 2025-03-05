import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '@/redux/slices/candidateSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import React, { useCallback } from 'react'

import { RootButton } from '@/components/ui/buttons/RootButton'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { SmallDesc } from '@/components/ui/descriptions/SmallDesc'
import { Icon } from '@/components/ui/general/Icon'
import { PopupDescLayout } from '@/components/layouts/PopupLayout/PopupDescLayout'
import { usePopup } from '@/components/layouts/PopupLayout/PopupProvider'
import { PopupFormLayout } from '@/components/layouts/PopupLayout/PopupFormLayout'
import { SignUpPopup } from '../SignUpPopup'
import { ForgotPopup } from '../ForgotPopup'
import { Loader } from '@/components/ui/general/Loader'
import { ErrorForm } from '@/components/ui/general/ErrorForm'

import styles from './styles.module.scss'

export const SignInPopup = React.memo(() => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { closePopup, openPopup } = usePopup()
	const { serverStatus, errorMessage, errorArray } = useSelector(
		state => state.candidate
	)

	const handleSignUp = useCallback(() => {
		closePopup()

		setTimeout(() => {
			openPopup(<SignUpPopup />)
		}, 150)
	}, [])

	const handleClickForgot = useCallback(() => {
		closePopup()

		setTimeout(() => {
			openPopup(<ForgotPopup />, { shared: true })
		}, 150)
	}, [])

	const findErrorField = useCallback(field => {
		if (errorArray) {
			return errorArray.find(item => item.field === field)
		} else return false
	}, [])

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const submit = useCallback(
		async data => {
			const { email, password } = data

			try {
				const resultAction = await dispatch(signIn({ email, password }))

				const originalPromiseResult = unwrapResult(resultAction)

				if (!originalPromiseResult) return

				reset()
				navigate('/dashboard')
				closePopup()
			} catch (rejectedValueOrSerializedError) {
				console.log(rejectedValueOrSerializedError)
			}
		},
		[navigate]
	)

	return (
		<>
			<PopupDescLayout
				title={'Hello friend!'}
				text={'Enter your personal details and start journey with us.'}
			>
				<RootButton onClickBtn={handleSignUp} text={'Sign up'} icon='sign-up' />
			</PopupDescLayout>

			<PopupFormLayout
				title={'Sign in to app'}
				socials={true}
				subtitle={'or use email for login'}
			>
				<form
					className={styles.signin_form_wrapper}
					onSubmit={handleSubmit(data => submit(data))}
				>
					<label
						htmlFor='email'
						className={`${styles.signin_form_label} ${
							(errors.email || findErrorField('email')) && styles.error
						}`}
					>
						<div className={styles.signin_form_control}>
							<RootDesc>
								<span>Email</span>
							</RootDesc>

							{(errors.email || findErrorField('email')) && (
								<>
									<Icon id={'error-icon'} />

									<SmallDesc>
										<p>Incorrect email.</p>
									</SmallDesc>
								</>
							)}
						</div>

						<input
							{...register('email', {
								required: true,
								pattern:
									/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
							})}
						/>
					</label>

					<label
						htmlFor='password'
						className={`${styles.signin_form_label} ${
							(errors.password || findErrorField('password')) && styles.error
						}`}
					>
						<div className={styles.signin_form_control}>
							<RootDesc>
								<span>Password</span>
							</RootDesc>

							{(errors.password || findErrorField('password')) && (
								<>
									<Icon id={'error-icon'} />

									<SmallDesc>
										<p>Incorrect password.</p>
									</SmallDesc>
								</>
							)}
						</div>

						<input {...register('password', { required: true })} />
					</label>

					<RootDesc>
						<b onClick={handleClickForgot}>Forgot your password ?</b>
					</RootDesc>

					<RootButton
						type={'submit'}
						onClickBtn={() => console.log('')}
						text={'Sign in'}
						icon='sign-in'
					/>

					<ErrorForm error={errorMessage} bottom={60} />
				</form>
			</PopupFormLayout>
		</>
	)
})
