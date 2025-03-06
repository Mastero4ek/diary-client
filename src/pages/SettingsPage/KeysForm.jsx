import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateKeys } from '@/redux/slices/candidateSlice'
import { useForm } from 'react-hook-form'

import { InnerBlock } from '@/components/ui/general/InnerBlock'
import { RootButton } from '@/components/ui/buttons/RootButton'
import { SmallDesc } from '@/components/ui/descriptions/SmallDesc'
import { Icon } from '@/components/ui/general/Icon'

import styles from './styles.module.scss'

export const KeysForm = ({ exchange }) => {
	const { user } = useSelector(state => state.candidate)
	const dispatch = useDispatch()

	const {
		reset,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm()

	const handleClickRemove = useCallback(
		exchange => {
			dispatch(
				updateKeys({
					exchange: exchange.name.toLowerCase(),
					api: '',
					secret: '',
				})
			)
		},
		[dispatch, user]
	)

	const submit = useCallback(
		data => {
			const api = data[`${exchange.name.toLowerCase()}_api`]
			const secret = data[`${exchange.name.toLowerCase()}_secret`]

			dispatch(
				updateKeys({
					exchange: exchange.name.toLowerCase(),
					api,
					secret,
				})
			)

			reset()
		},
		[dispatch, user]
	)

	const currentExchangeName = exchange.name.toLowerCase()
	const apiValue = watch(`${currentExchangeName}_api`, '')
	const secretValue = watch(`${currentExchangeName}_secret`, '')
	const exchangeObj = user?.keys.find(key => key.name === exchange.name)

	return (
		<div className={styles.keys_item_content}>
			<div className={styles.keys_item_controls}>
				<InnerBlock>
					<div className={styles.keys_item_logo}>
						<Icon id={`${exchange?.name.toLowerCase()}-logo`} />
					</div>
				</InnerBlock>

				<div className={styles.keys_inputs_btns}>
					<RootButton
						onClickBtn={() => handleClickRemove(exchange)}
						disabled={
							exchangeObj &&
							(exchangeObj?.api === '' || exchangeObj?.secret === '')
						}
						icon='remove'
					/>

					<RootButton
						onClickBtn={handleSubmit(submit)}
						text={'Save'}
						icon='update'
						disabled={apiValue === '' || secretValue === ''}
					/>
				</div>
			</div>

			<form>
				<label
					htmlFor={`${currentExchangeName}_api`}
					className={`${styles.keys_form_label} ${
						errors[`${currentExchangeName}_api`] && styles.error
					}`}
				>
					{errors[`${currentExchangeName}_api`] && (
						<div className={styles.keys_form_control}>
							<Icon id={'error-icon'} />

							<SmallDesc>
								<p>Api-key is required.</p>
							</SmallDesc>
						</div>
					)}

					<input
						placeholder={exchange.api === '' ? 'Your api key' : exchange.api}
						{...register(`${currentExchangeName}_api`, { required: true })}
					/>
				</label>

				<label
					htmlFor={`${currentExchangeName}_secret`}
					className={`${styles.keys_form_label} ${
						errors[`${currentExchangeName}_secret`] && styles.error
					}`}
				>
					{errors[`${currentExchangeName}_secret`] && (
						<div className={styles.keys_form_control}>
							<Icon id={'error-icon'} />

							<SmallDesc>
								<p>Secret-key is required.</p>
							</SmallDesc>
						</div>
					)}

					<input
						placeholder={
							exchange.secret === '' ? 'Your secret key' : exchange.secret
						}
						{...register(`${currentExchangeName}_secret`, {
							required: true,
						})}
					/>
				</label>
			</form>
		</div>
	)
}
