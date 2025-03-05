import React from 'react'
import { useSelector } from 'react-redux'

import { Logo } from '@/components/ui/general/Logo'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { H2 } from '@/components/ui/titles/H2'
import { DownloadButton } from '@/components/ui/buttons/DownloadButton'

import bybit from '@/assets/images/exchanges/bybit-logo.svg'
import mexc from '@/assets/images/exchanges/mexc-logo.svg'
import okx from '@/assets/images/exchanges/okx-logo.svg'

import styles from './styles.module.scss'

const exchangeImages = { bybit, mexc, okx }

export const SharedPopupLayout = props => {
	const { popup_id, popup_name, children } = props
	const { user } = useSelector(state => state.candidate)
	const { exchange } = useSelector(state => state.filters)

	const currentExchange = () => {
		return exchangeImages[exchange?.name] || exchangeImages.bybit
	}

	return (
		<>
			<div id={popup_id} className={styles.info_wrapper}>
				<div className={styles.info_head}>
					<Logo />

					<div className={styles.info_head_name}>
						<OuterBlock>
							<H2>
								<span>{user?.name || 'User_name'}</span>
							</H2>
						</OuterBlock>
					</div>
				</div>

				<div className={styles.info_wrap}>
					<div className={styles.info_exchange}>
						<img src={currentExchange()} alt='exchange' />
					</div>

					{children}
				</div>
			</div>

			<DownloadButton selector={`#${popup_id}`} name={popup_name} />
		</>
	)
}
