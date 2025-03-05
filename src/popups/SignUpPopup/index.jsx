import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { signUp } from '@/redux/slices/candidateSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import React, { useCallback } from 'react'

import { RootButton } from '@/components/ui/buttons/RootButton'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { SmallDesc } from '@/components/ui/descriptions/SmallDesc'
import { Icon } from '@/components/ui/general/Icon'
import { PopupDescLayout } from '@/components/layouts/PopupLayout/PopupDescLayout'
import { usePopup } from '@/components/layouts/PopupLayout/PopupProvider'
import { SuccessSignUpPopup } from '../SuccessSignUpPopup'
import { PopupFormLayout } from '@/components/layouts/PopupLayout/PopupFormLayout'
import { SignInPopup } from '../SignInPopup'
import { ErrorForm } from '@/components/ui/general/ErrorForm'

import styles from './styles.module.scss'

export const SignUpPopup = React.memo(() => {
	const dispatch = useDispatch()
	const { closePopup, openPopup } = usePopup()
	const { errorMessage, errorArray } = useSelector(state => state.candidate)

	const handleSignIn = useCallback(() => {
		closePopup()

		setTimeout(() => {
			openPopup(<SignInPopup />)
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
			const { name, email, password, confirm_password, agreement } = data

			try {
				const resultAction = await dispatch(
					signUp({ name, email, password, confirm_password, agreement })
				)

				// Check if the action was fulfilled and has user data
				if (
					resultAction.type === 'user/sign-up/fulfilled' &&
					resultAction.payload?.user
				) {
					// Clear form and close current popup
					reset()
					closePopup()

					// Show success popup
					setTimeout(() => {
						openPopup(<SuccessSignUpPopup />, { shared: true })
					}, 150)
				} else {
					console.error('Signup response invalid:', resultAction)
				}
			} catch (error) {
				console.error('Signup error:', error)
			}
		},
		[dispatch, reset, closePopup, openPopup]
	)

	return (
		<>
			<PopupFormLayout
				title={'Create Account'}
				socials={true}
				subtitle={'or use email for registration'}
			>
				<form
					className={styles.signup_form_wrapper}
					onSubmit={handleSubmit(data => submit(data))}
				>
					<label
						htmlFor='name'
						className={`${styles.signup_form_label} ${
							(errors.name || findErrorField('name')) && styles.error
						}`}
					>
						<div className={styles.signup_form_control}>
							<RootDesc>
								<span>Name</span>
							</RootDesc>

							{(errors.name || findErrorField('name')) && (
								<>
									<Icon id={'error-icon'} />

									<SmallDesc>
										<p>Name is required.</p>
									</SmallDesc>
								</>
							)}
						</div>

						<input {...register('name', { required: true })} />
					</label>

					<label
						htmlFor='email'
						className={`${styles.signup_form_label} ${
							(errors.email || findErrorField('email')) && styles.error
						}`}
					>
						<div className={styles.signup_form_control}>
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
						className={`${styles.signup_form_label} ${
							(errors.password || findErrorField('password')) && styles.error
						}`}
					>
						<div className={styles.signup_form_control}>
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

					<label
						htmlFor='confirm_password'
						className={`${styles.signup_form_label} ${
							(errors.confirm_password || findErrorField('confirm_password')) &&
							styles.error
						}`}
					>
						<div className={styles.signup_form_control}>
							<RootDesc>
								<span>Confirm password</span>
							</RootDesc>

							{(errors.confirm_password ||
								findErrorField('confirm_password')) && (
								<>
									<Icon id={'error-icon'} />

									<SmallDesc>
										<p>Incorrect password.</p>
									</SmallDesc>
								</>
							)}
						</div>

						<input {...register('confirm_password', { required: true })} />
					</label>

					<label htmlFor='agreement' className={styles.signup_form_label}>
						<input
							id='agreement'
							type='checkbox'
							{...register('agreement', { required: true })}
						/>

						<div className={styles.signup_form_checkbox}>
							<i
								style={
									errors.agreement || findErrorField('agreement')
										? { border: '1rem solid var(--red)' }
										: {}
								}
							>
								<Icon id={'checked'} />
							</i>

							<SmallDesc>
								<span>
									By clicking you agree to our{' '}
									<Link to={'/privacy'} onClick={() => closePopup()}>
										Privacy Statement
									</Link>
								</span>
							</SmallDesc>
						</div>
					</label>

					<div className={styles.signup_form_btn}>
						<RootButton
							type={'submit'}
							onClickBtn={() => console.log('')}
							text={'Sign up'}
							icon='sign-up'
						/>
					</div>

					<ErrorForm error={errorMessage} bottom={60} />
				</form>
			</PopupFormLayout>

			<PopupDescLayout
				title={'Welcome back!'}
				text={'To keep connected with us please login with your personal info.'}
			>
				<RootButton onClickBtn={handleSignIn} text={'Sign in'} icon='sign-in' />
			</PopupDescLayout>
		</>
	)
})
