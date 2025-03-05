import React from 'react'

import { FilterLayout } from '../FilterLayout'
import { InnerBlock } from '@/components/ui/general/InnerBlock'

import styles from './styles.module.scss'

export const PageLayout = React.memo(props => {
	const {
		filter = true,
		disabled = false,
		periods,
		entries,
		calendar,
		search,
		total,
		children,
		chartWidth,
		update,
	} = props

	return (
		<div className={styles.page_wrapper}>
			<InnerBlock>
				<div className={styles.page}>
					{filter && (
						<FilterLayout
							disabled={disabled}
							periods={periods}
							entries={entries}
							calendar={calendar}
							search={search}
							total={total}
							update={update}
						/>
					)}

					<div
						style={{ gridTemplateColumns: `1fr ${chartWidth}rem` }}
						className={styles.page_content}
					>
						{children}
					</div>
				</div>
			</InnerBlock>
		</div>
	)
})
