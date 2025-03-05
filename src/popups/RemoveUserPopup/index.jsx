import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import React, { useCallback, useEffect } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import { removeUser, setChangeUser } from '@/redux/slices/candidateSlice'

import { RootButton } from '@/components/ui/buttons/RootButton'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { SmallDesc } from '@/components/ui/descriptions/SmallDesc'
import { Icon } from '@/components/ui/general/Icon'
import { Loader } from '@/components/ui/general/Loader'
import { PopupDescLayout } from '@/components/layouts/PopupLayout/PopupDescLayout'
import { usePopup } from '@/components/layouts/PopupLayout/PopupProvider'
import { PopupFormLayout } from '@/components/layouts/PopupLayout/PopupFormLayout'
import { ErrorForm } from '@/components/ui/general/ErrorForm'

import styles from './styles.module.scss'

export const RemoveUserPopup = React.memo(() => {
	const { closePopup } = usePopup()
	const { user, errorMessage, errorArray, serverStatus, isAuth } = useSelector(
		state => state.candidate
	)
	const dispatch = useDispatch()

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const submit = useCallback(async data => {
		try {
			const resultAction = dispatch(
				removeUser({ current_email: user.email, fill_email: data.email })
			)
			const originalPromiseResult = unwrapResult(resultAction)

			if (!originalPromiseResult) return

			reset()
			closePopup()
		} catch (rejectedValueOrSerializedError) {
			console.log(rejectedValueOrSerializedError)
		}
	}, [])

	const findErrorField = useCallback(field => {
		if (errorArray) {
			return errorArray.find(item => item.field === field)
		} else return false
	}, [])

	useEffect(() => {
		if (!isAuth) {
			dispatch(setChangeUser(user))
			closePopup()
		}
	}, [user])

	return (
		<>
			<PopupDescLayout
				title={`Dear ${user?.name || 'User_name'}!`}
				text={
					<>
						Enter the email to which this account is registered to delete your
						account! <br /> Once your account is deleted, there is no going
						back.
					</>
				}
			/>

			<PopupFormLayout>
				<form
					className={styles.remove_form_wrapper}
					onSubmit={handleSubmit(data => submit(data))}
				>
					<label
						htmlFor='email'
						className={`${styles.remove_form_label} ${
							(errors.email || findErrorField('email')) && styles.error
						}`}
					>
						<div className={styles.remove_form_control}>
							<RootDesc>
								<span>Your Account Email</span>
							</RootDesc>

							{errors.email && (
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

					<RootDesc>
						<span>Do you really want to delete this account PERMANENTLY?</span>
					</RootDesc>

					<RootButton
						type={'submit'}
						onClickBtn={() => console.log('')}
						text={'Yes, REMOVE!'}
						disabled={serverStatus === 'loading' ? true : false}
					/>

					<ErrorForm error={errorMessage} bottom={85} />

					{serverStatus === 'loading' && <Loader logo={false} />}
				</form>
			</PopupFormLayout>
		</>
	)
})
