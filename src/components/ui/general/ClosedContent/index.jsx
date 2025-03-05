import { Icon } from '@/components/ui/general/icon'
import styles from './styles.module.scss'
import React from 'react'

export const ClosedContent = React.memo(({ width }) => {
	return (
		<i className={styles.closed}>
			<Icon width={width} height={width} id='close' />
		</i>
	)
})
