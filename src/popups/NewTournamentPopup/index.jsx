import './calendar.scss'

import React, { useCallback, useState } from 'react'

import moment from 'moment'
import DatePicker from 'react-date-picker'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import coverDefault from '@/assets/images/general/default_tournament.png'
import { PopupDescLayout } from '@/components/layouts/PopupLayout/PopupDescLayout'
import { PopupFormLayout } from '@/components/layouts/PopupLayout/PopupFormLayout'
import { usePopup } from '@/components/layouts/PopupLayout/PopupProvider'
import { RootButton } from '@/components/ui/buttons/RootButton'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { Icon } from '@/components/ui/general/Icon'
import { InnerBlock } from '@/components/ui/general/InnerBlock'
import { RootSelect } from '@/components/ui/inputs/RootSelect'
import {
	createTournament,
	setErrorMessage,
} from '@/redux/slices/tournamentSlice'

import styles from './styles.module.scss'

export const NewTournamentPopup = () => {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		control,
		formState: { errors },
	} = useForm()
	const { language } = useSelector(state => state.settings)
	const { serverStatus, errorMessage } = useSelector(state => state.tournaments)

	const initialNextMonth = moment().add(1, 'month')
	const initialStartDate = initialNextMonth.clone().startOf('month').toDate()
	const initialEndDate = initialNextMonth.clone().endOf('month').toDate()

	const [registrationDate, setRegistrationDate] = useState(initialStartDate)
	const [startDate, setStartDate] = useState(initialStartDate)
	const [endDate, setEndDate] = useState(initialEndDate)
	const [cover, setCover] = useState(null)

	const { closePopup } = usePopup()

	const dispatch = useDispatch()

	const handleCoverChange = e => {
		const file = e.target.files[0]

		if (file) {
			setCover(file)
			setValue('cover', file)
		}
	}

	const handleRemoveCover = () => {
		setCover(null)
		setValue('cover', null)
	}

	const submit = useCallback(
		async data => {
			const fullData = {
				name: data.name,
				description: data.description,
				exchange: data.exchange,
				cover,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
				registration_date: registrationDate.toISOString(),
			}
			const result = await dispatch(createTournament(fullData))

			if (result.meta.requestStatus === 'fulfilled') {
				reset()
				setCover(null)
				setStartDate(initialStartDate)
				setEndDate(initialEndDate)
				setRegistrationDate(initialStartDate)

				closePopup()
			} else {
				dispatch(setErrorMessage(result.payload.message))
			}
		},
		[
			reset,
			cover,
			startDate,
			endDate,
			registrationDate,
			initialStartDate,
			dispatch,
		]
	)

	const EXCHANGE_OPTIONS = [
		{
			name: (
				<>
					<Icon id='bybit-logo' /> (Bybit)
				</>
			),
			value: 'bybit',
		},
		{
			name: (
				<>
					<Icon id='mexc-logo' /> (Mexc)
				</>
			),
			value: 'mexc',
		},
		{
			name: (
				<>
					<Icon id='okx-logo' /> (OKX)
				</>
			),
			value: 'okx',
		},
	]

	return (
		<>
			<PopupDescLayout title={'New Tournament'}>
				<label htmlFor='exchange' className={styles.tournament_form_label}>
					<div className={styles.tournament_form_control}>
						<RootDesc>
							<span>Exchange</span>
						</RootDesc>

						<Controller
							name='exchange'
							control={control}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<RootSelect
									className={`${styles.tournament_form_select} ${
										fieldState.error ? styles.error : ''
									}`}
									options={EXCHANGE_OPTIONS}
									value={field.value}
									onChange={field.onChange}
									getLabel={item => item.name}
									getValue={item => item.value}
								>
									{fieldState.error && <Icon id='error-icon' />}
								</RootSelect>
							)}
						/>
					</div>
				</label>

				<label htmlFor='cover' className={`${styles.tournament_form_label}`}>
					<div className={styles.tournament_form_control}>
						<RootDesc>
							<span>Cover</span>
						</RootDesc>

						<div className={styles.tournament_photo}>
							<InnerBlock>
								<img
									style={{ opacity: cover ? 1 : 0.5 }}
									src={cover ? URL.createObjectURL(cover) : coverDefault}
									alt='cover'
								/>

								<label>
									<input
										type='file'
										accept='image/*'
										onChange={handleCoverChange}
										style={{ display: 'none' }}
									/>
									<Icon id='change-photo' />
								</label>
							</InnerBlock>

							<RootButton
								disabled={!cover}
								onClickBtn={handleRemoveCover}
								icon='cancel'
								text='Remove cover'
							/>
						</div>
					</div>
				</label>
			</PopupDescLayout>

			<PopupFormLayout>
				<form
					className={styles.tournament_form_wrapper}
					onSubmit={handleSubmit(data => submit(data))}
				>
					<label htmlFor='name' className={styles.tournament_form_label}>
						<div
							className={`${styles.tournament_form_control} ${
								errors.name ? styles.error : ''
							}`}
						>
							<RootDesc>
								<span>Name</span>
							</RootDesc>

							{errors.name && <Icon id={'error-icon'} />}

							<input type='text' {...register('name', { required: true })} />
						</div>
					</label>

					<label
						htmlFor='description'
						className={`${styles.tournament_form_label}`}
					>
						<div className={styles.tournament_form_control}>
							<RootDesc>
								<span>Description</span>
							</RootDesc>

							<input type='text' {...register('description')} />
						</div>
					</label>

					<label
						htmlFor='registrationDate'
						className={styles.tournament_form_label}
					>
						<div className={styles.tournament_form_control}>
							<RootDesc>
								<span>Registration Date</span>
							</RootDesc>

							<div className={styles.calendar_wrapper}>
								<DatePicker
									value={registrationDate}
									locale={language === 'ru' ? 'ru-RU' : 'en-EN'}
									calendarIcon={<Icon id='calendar' />}
									onChange={date => {
										setRegistrationDate(date)
										setValue('registrationDate', date ? date.toISOString() : '')
									}}
								/>
							</div>
						</div>
					</label>

					<label htmlFor='startDate' className={styles.tournament_form_label}>
						<div className={styles.tournament_form_control}>
							<RootDesc>
								<span>Start Date</span>
							</RootDesc>

							<div className={styles.calendar_wrapper}>
								<DatePicker
									value={startDate}
									locale={language === 'ru' ? 'ru-RU' : 'en-EN'}
									calendarIcon={<Icon id='calendar' />}
									onChange={date => {
										setStartDate(date)
										setValue('startDate', date ? date.toISOString() : '')
									}}
								/>
							</div>
						</div>
					</label>

					<label htmlFor='endDate' className={styles.tournament_form_label}>
						<div className={styles.tournament_form_control}>
							<RootDesc>
								<span>End Date</span>
							</RootDesc>

							<div className={styles.calendar_wrapper}>
								<DatePicker
									value={endDate}
									locale={language === 'ru' ? 'ru-RU' : 'en-EN'}
									calendarIcon={<Icon id='calendar' />}
									onChange={date => {
										setEndDate(date)
										setValue('endDate', date ? date.toISOString() : '')
									}}
								/>
							</div>
						</div>
					</label>

					<RootButton type='submit' text='Create Tournament' icon='join' />
				</form>
			</PopupFormLayout>
		</>
	)
}
