import { H4 } from '@/components/ui/titles/H4'
import styles from './styles.module.scss'
import React from 'react'

export const ErrorTable = React.memo(({ error }) => {
	return (
		<div className={styles.error}>
			<H4>
				<span>{error}</span>
			</H4>
		</div>
	)
})
