import React from 'react'
import styles from './styles.module.scss'

export const RootDesc = React.memo(props => {
	const { children } = props

	return <div className={styles.root_desc}>{children}</div>
})
