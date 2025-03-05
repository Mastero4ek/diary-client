import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { Icon } from '@/components/ui/general/Icon'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'

import styles from './styles.module.scss'

export const BackButton = React.memo(() => {
	const navigate = useNavigate()

	const handleClickBack = useCallback(() => {
		navigate(-1)
	}, [])

	return (
		<button
			onClick={handleClickBack}
			type='button'
			className={styles.back_button}
		>
			<Icon id={'back-arrow'} />

			<RootDesc>
				<span>Back</span>
			</RootDesc>
		</button>
	)
})
