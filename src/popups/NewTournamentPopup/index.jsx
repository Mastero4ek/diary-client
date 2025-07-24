import './calendar.scss'

import React, { useCallback, useState } from 'react'

import DatePicker from 'react-date-picker'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import coverDefault from '@/assets/images/general/default_tournament.png'
import { PopupDescLayout } from '@/components/layouts/PopupLayout/PopupDescLayout'
import { PopupFormLayout } from '@/components/layouts/PopupLayout/PopupFormLayout'
import { RootButton } from '@/components/ui/buttons/RootButton'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { Icon } from '@/components/ui/general/Icon'
import { InnerBlock } from '@/components/ui/general/InnerBlock'

import styles from './styles.module.scss'

export const NewTournamentPopup = () => {
	const { register, handleSubmit, setValue, reset } = useForm()
	const dispatch = useDispatch()
	const { language } = useSelector(state => state.settings)

	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)
	const [registrationDate, setRegistrationDate] = useState(null)
	const [cover, setCover] = useState(null)

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
		data => {
			console.log(data)
			reset()
		},
		[dispatch, reset]
	)

	return (
		<>
			<PopupDescLayout title={'New Tournament'}>
				<label htmlFor='exchange' className={`${styles.tournament_form_label}`}>
					<div className={styles.tournament_form_control}>
						<RootDesc>
							<span>Exchange</span>
						</RootDesc>

						<select {...register('exchange')}>
							<option value='bybit'>Bybit</option>
							<option value='mexc'>Mexc</option>
							<option value='okx'>OKX</option>
						</select>
						{/* TODO: на примере Entries сделать выпадающий список бирж - отдельный компонент - использовать его и для этого компонента */}
						{/* <Entries /> */}
					</div>
				</label>

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
			</PopupDescLayout>

			<PopupFormLayout>
				<form
					className={styles.tournament_form_wrapper}
					onSubmit={handleSubmit(data => submit(data))}
				>
					<label htmlFor='name' className={`${styles.tournament_form_label}`}>
						<div className={styles.tournament_form_control}>
							<RootDesc>
								<span>Name</span>
							</RootDesc>

							<input type='text' {...register('name')} />
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
						htmlFor='startDate'
						className={`${styles.tournament_form_label}`}
					>
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

					<label
						htmlFor='endDate'
						className={`${styles.tournament_form_label}`}
					>
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

					<label
						htmlFor='registrationDate'
						className={`${styles.tournament_form_label}`}
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

					<RootButton type='submit' text='Create Tournament' icon='join' />
				</form>
			</PopupFormLayout>
		</>
	)
}
