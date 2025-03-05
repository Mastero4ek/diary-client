import { Buttons } from './Buttons'
import { Periods } from './Periods'
import { Entries } from './Entries'
import { Calendar } from './Calendar'
import { Search } from './Search'
import { Total } from './Total'
import React, { useState } from 'react'

import styles from './styles.module.scss'

export const FilterLayout = React.memo(props => {
	const { periods, entries, calendar, search, total, update, disabled } = props
	const [inputSearch, setInputSearch] = useState('')

	return (
		<div
			className={
				disabled
					? `${styles.filter_wrapper} ${styles.filter_wrapper_dis}`
					: styles.filter_wrapper
			}
		>
			{periods && <Periods />}
			{total && <Total />}
			{calendar && <Calendar />}

			{search && (
				<Search inputSearch={inputSearch} setInputSearch={setInputSearch} />
			)}

			{entries && <Entries />}

			<Buttons onClickUpdate={update} setInputSearch={setInputSearch} />
		</div>
	)
})
