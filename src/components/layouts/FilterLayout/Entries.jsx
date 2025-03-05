import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setRemoveBtn, setLimit } from '@/redux/slices/filtersSlice'

import { Icon } from '@/components/ui/general/Icon'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { InnerBlock } from '@/components/ui/general/InnerBlock'

import styles from './styles.module.scss'

export const Entries = React.memo(() => {
	const dispatch = useDispatch()
	const entriesRef = useRef()

	const [open, setOpen] = useState(false)
	const { limit } = useSelector(state => state.filters)

	const toggleEntries = () => setOpen(prev => !prev)

	const handleListItemClick = useCallback(
		item => {
			dispatch(setLimit(item))

			dispatch(setRemoveBtn(false))
			setOpen(false)
		},
		[dispatch]
	)

	const handleClickOutside = useCallback(e => {
		const path = e.composedPath ? e.composedPath() : e.path

		if (!path.includes(entriesRef.current)) {
			setOpen(false)
		}
	}, [])

	useEffect(() => {
		document.body.addEventListener('click', handleClickOutside)

		return () => document.body.removeEventListener('click', handleClickOutside)
	}, [handleClickOutside])

	const ItemBlock = open ? InnerBlock : OuterBlock

	return (
		<div ref={entriesRef} className={styles.entries}>
			<ItemBlock>
				<div onClick={toggleEntries} className={styles.entries_head}>
					<Icon id={'entries'} />

					<RootDesc>
						<span>{limit} entries</span>
					</RootDesc>
				</div>
			</ItemBlock>

			<ul
				className={`${styles.entries_list} ${
					open ? styles.entries_list_active : ''
				}`}
			>
				{[3, 5, 10].map(item => (
					<li onClick={() => handleListItemClick(item)} key={item}>
						<RootDesc>
							<span>{item}</span>
						</RootDesc>
					</li>
				))}
			</ul>
		</div>
	)
})
