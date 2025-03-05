import { useDispatch, useSelector } from 'react-redux'
import {
	setFilter,
	setDate,
	setRemoveBtn,
	setLimit,
	setSearch,
} from '@/redux/slices/filtersSlice'
import moment from 'moment'
import React, { useCallback } from 'react'

import { RootButton } from '@/components/ui/buttons/RootButton'

import styles from './styles.module.scss'

export const Buttons = React.memo(({ onClickUpdate, setInputSearch }) => {
	const { remove_btn } = useSelector(state => state.filters)

	const dispatch = useDispatch()

	const handleClickRemove = useCallback(() => {
		dispatch(setLimit(5))

		dispatch(
			setFilter({
				name: 'week',
				id: 0,
			})
		)

		dispatch(
			setDate({
				start_date: Date.parse(moment().startOf('isoWeek')),
				end_date: Date.parse(new Date()),
			})
		)

		dispatch(setRemoveBtn(true))

		dispatch(setSearch(''))
		setInputSearch('')
	}, [dispatch])

	return (
		<div className={styles.filter_buttons}>
			<RootButton
				onClickBtn={handleClickRemove}
				disabled={remove_btn}
				icon='remove'
			/>

			<RootButton onClickBtn={onClickUpdate} icon='update' />
		</div>
	)
})
