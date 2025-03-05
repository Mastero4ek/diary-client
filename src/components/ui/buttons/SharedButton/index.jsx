import React, { useCallback } from 'react'

import { Icon } from '@/components/ui/general/Icon'
import { usePopup } from '@/components/layouts/PopupLayout/PopupProvider'

import styles from './styles.module.scss'

export const SharedButton = ({ popup }) => {
	const { openPopup } = usePopup()

	const handleClickShared = () => {
		openPopup(popup, { shared: true })
	}

	return (
		<button
			onClick={handleClickShared}
			type='button'
			className={styles.shared_button}
			aria-label='shared'
		>
			<Icon id='shared' />
		</button>
	)
}
