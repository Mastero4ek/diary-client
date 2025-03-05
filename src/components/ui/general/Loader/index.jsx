import { useSelector } from 'react-redux'
import { Logo } from '@/components/ui/general/Logo'

import styles from './styles.module.scss'
import React, { useEffect } from 'react'

export const Loader = React.memo(({ logo = true }) => {
	const { language, isLoadingTheme } = useSelector(state => state.settings)

	useEffect(() => {
		if (isLoadingTheme) {
			const scrollBarWidth =
				window.innerWidth - document.documentElement.clientWidth

			document.body.style.overflow = 'hidden'
			document.body.style.paddingRight = `${scrollBarWidth}rem`

			return () => {
				document.body.style.overflow = ''
				document.body.style.paddingRight = ''
			}
		}
	}, [isLoadingTheme])

	return (
		<i
			className={styles.loader}
			style={
				isLoadingTheme ? { backdropFilter: 'blur(40rem) grayscale(100%)' } : {}
			}
		>
			{logo && <Logo desc={false} />}

			<i>
				{language === 'ru' ? (
					<>
						<span>З</span>
						<span>а</span>
						<span>г</span>
						<span>р</span>
						<span>у</span>
						<span>з</span>
						<span>к</span>
						<span>а</span>
					</>
				) : (
					<>
						<span>L</span>
						<span>o</span>
						<span>a</span>
						<span>d</span>
						<span>i</span>
						<span>n</span>
						<span>g</span>
					</>
				)}
			</i>
		</i>
	)
})
