import React from 'react'

import { Icon } from '@/components/ui/general/Icon'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'

import styles from './styles.module.scss'

export const RootButton = React.memo(
	({ type = 'button', disabled, onClickBtn, text, icon }) => {
		return (
			<button
				disabled={disabled}
				onClick={!disabled ? onClickBtn : undefined}
				type={type}
				className={styles.root_button}
			>
				{text && (
					<RootDesc>
						<span>{text}</span>
					</RootDesc>
				)}
				{icon && <Icon id={icon} />}
			</button>
		)
	}
)
