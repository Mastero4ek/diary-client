import { useDispatch, useSelector } from 'react-redux'
import React, { useCallback, useEffect, useState } from 'react'
import {
	setPhone,
	editUser,
	removeCover,
	setChangeUser,
} from '@/redux/slices/candidateSlice'
import { useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import ru from 'react-phone-input-2/lang/ru.json'
import { unwrapResult } from '@reduxjs/toolkit'

import { usePopup } from '@/components/layouts/PopupLayout/PopupProvider'
import { InnerBlock } from '@/components/ui/general/InnerBlock'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { PageLayout } from '@/components/layouts/PageLayout'
import { RootButton } from '@/components/ui/buttons/RootButton'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { SmallDesc } from '@/components/ui/descriptions/SmallDesc'
import { DescLayout } from '@/components/layouts/PageLayout/DescLayout'
import { Icon } from '@/components/ui/general/Icon'
import { Level } from './Level'
import { RemoveUserPopup } from '@/popups/RemoveUserPopup'
import { AvatarUserPopup } from '@/popups/AvatarUserPopup'
import { Loader } from '@/components/ui/general/Loader'

import avatarDefault from '@/assets/images/general/default_avatar.png'
import styles from './styles.module.scss'
import './phone_input.scss'

export const ProfilePage = React.memo(() => {
	const [popup, setPopup] = useState(false)
	const [password, setPassword] = useState('')
	const [photoFile, setPhotoFile] = useState(null)
	const { openPopup } = usePopup()
	const { user, changeUser, serverStatus } = useSelector(
		state => state.candidate
	)

	const dispatch = useDispatch()

	const {
		reset,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm()

	const submit = useCallback(async data => {
		const { name, last_name, email, password, phone, cover } = data

		try {
			const resultAction = await dispatch(
				editUser({ name, last_name, email, password, phone, cover })
			)
			const originalPromiseResult = unwrapResult(resultAction)

			if (!originalPromiseResult) return

			setPassword('')
			setPhotoFile(null)
			reset()
		} catch (rejectedValueOrSerializedError) {
			console.log(rejectedValueOrSerializedError)
		}
	}, [])

	const handleChangeField = (e, field) => {
		dispatch(setChangeUser({ ...changeUser, [field]: e.target.value }))
	}

	const handleClickRemove = useCallback(() => {
		openPopup(<RemoveUserPopup />, { shared: true })
	}, [])

	const handleClickChangePhoto = useCallback(() => {
		openPopup(<AvatarUserPopup setPhotoFile={setPhotoFile} />, { shared: true })
	}, [])

	const handleRemoveCover = useCallback(() => {
		if (photoFile) {
			setValue('cover', null)
			setPhotoFile(null)
		} else {
			const lastSlashIndex = changeUser.cover.lastIndexOf('/')
			const filename = changeUser.cover.substring(lastSlashIndex + 1)

			dispatch(removeCover({ email: changeUser.email, filename }))
			setPhotoFile(null)
		}
	}, [dispatch, photoFile, changeUser])

	useEffect(() => {
		if (photoFile) {
			setValue('cover', photoFile)
		}

		return () => {
			if (photoFile) {
				URL.revokeObjectURL(photoFile)
			}
		}
	}, [photoFile])

	const imageSrc = photoFile
		? URL.createObjectURL(photoFile)
		: changeUser?.cover || avatarDefault

	useEffect(() => {
		reset(changeUser)
	}, [changeUser, reset])

	useEffect(() => {
		const popupElement = document.getElementById('popup')
		popupElement ? setPopup(true) : setPopup(false)

		return () => dispatch(setChangeUser(user))
	}, [openPopup])

	return (
		<PageLayout chartWidth={600} filter={false}>
			<div style={{ marginBottom: 'auto' }}>
				<OuterBlock>
					<div className={styles.profile_wrapper}>
						<div className={styles.profile_wrap}>
							<div className={styles.profile_photo}>
								<InnerBlock>
									<img src={imageSrc} alt='avatar' />

									<div onClick={handleClickChangePhoto}>
										<Icon id={'change-photo'} />
									</div>
								</InnerBlock>

								<div className={styles.profile_photo_buttons}>
									<RootButton
										onClickBtn={handleRemoveCover}
										icon={photoFile ? 'cancel' : 'cross'}
										disabled={changeUser?.cover || photoFile ? false : true}
									/>

									<RootButton
										type={'submit'}
										onClickBtn={handleSubmit(data => submit(data))}
										text={'Save'}
										icon='save-changes'
										disabled={
											JSON.stringify(user) === JSON.stringify(changeUser) &&
											!photoFile &&
											password === ''
										}
									/>
								</div>
							</div>

							<form className={styles.profile_info}>
								<input
									type='hidden'
									{...register('cover', {
										value: photoFile,
									})}
								/>

								<input
									type='hidden'
									{...register('email', {
										value: changeUser?.email,
									})}
								/>

								<label
									htmlFor='name'
									className={`${styles.profile_form_label} ${
										errors.name && styles.error
									}`}
								>
									<div className={styles.profile_form_control}>
										{errors.name && (
											<>
												<Icon id={'error-icon'} />

												<SmallDesc>
													<p>Name is required.</p>
												</SmallDesc>
											</>
										)}
									</div>

									<input
										placeholder='Your Name'
										{...register('name', {
											required: true,
											value: changeUser?.name,
											onChange: e => handleChangeField(e, 'name'),
										})}
									/>
								</label>

								<label
									htmlFor='last_name'
									className={`${styles.profile_form_label} ${
										errors.last_name && styles.error
									}`}
								>
									<input
										placeholder='Your Last Name'
										{...register('last_name', {
											value: changeUser?.last_name,
											onChange: e => handleChangeField(e, 'last_name'),
										})}
									/>
								</label>

								<label htmlFor='phone' className={styles.profile_form_label}>
									<PhoneInput
										localization={ru}
										disableSearchIcon={true}
										disableDropdown={true}
										enableSearch={true}
										value={
											changeUser?.phone ? changeUser?.phone.toString() : ''
										}
										onChange={number => dispatch(setPhone(number))}
										inputProps={{
											name: 'phone',
											required: true,
										}}
									/>
								</label>

								<label
									htmlFor='password'
									className={`${styles.profile_form_label} ${
										errors.password && styles.error
									} ${!changeUser?.change_password && styles.warning}`}
								>
									<div className={styles.profile_form_control}>
										{errors.password && (
											<>
												<Icon id={'error-icon'} />

												<SmallDesc>
													<p>Incorrect password.</p>
												</SmallDesc>
											</>
										)}

										{!changeUser?.change_password && (
											<>
												<Icon id={'warning-icon'} />

												<SmallDesc>
													<p>Create your password, please!</p>
												</SmallDesc>
											</>
										)}
									</div>

									<input
										placeholder='New Password'
										{...register('password', {
											value: password,
											onChange: e => setPassword(e.target.value),
										})}
									/>
								</label>

								<label className={styles.profile_form_label}>
									<div className={styles.profile_form_fake_input}>
										<RootDesc>
											<span>{changeUser?.email}</span>
										</RootDesc>
									</div>
								</label>
							</form>
						</div>

						<Level />
					</div>
				</OuterBlock>
			</div>

			<OuterBlock>
				<DescLayout
					icon={'profile'}
					title={
						<>
							Edit your account <br /> or delete it permanently
						</>
					}
					description={
						<>
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque
							illo consequatur magni eos odit perferendis, cumque minus
							obcaecati reiciendis sed. Id in eaque asperiores. Enim autem
							aperiam cumque adipisci tenetur.
						</>
					}
				>
					<div className={styles.removeBtn}>
						<RootButton
							onClickBtn={handleClickRemove}
							text={'Remove'}
							icon={'remove'}
						/>
					</div>
				</DescLayout>
			</OuterBlock>
		</PageLayout>
	)
})
