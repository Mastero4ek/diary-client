import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { Icon } from '@/components/ui/general/Icon'
import { InnerBlock } from '@/components/ui/general/InnerBlock'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { H2 } from '@/components/ui/titles/H2'
import { SharedButton } from '@/components/ui/buttons/SharedButton'
import { SharedDashboardPopup } from '@/popups/SharedDashboardPopup'

import hamster from '@/assets/images/levels/hamster.png'
import bear from '@/assets/images/levels/bear.png'
import bull from '@/assets/images/levels/bull.png'
import shark from '@/assets/images/levels/shark.png'
import whale from '@/assets/images/levels/whale.png'

import styles from './styles.module.scss'

const statsList = [
	{
		id: 0,
		name: 'Wallet Balance',
		value: `27.9976`,
	},
	{
		id: 1,
		name: 'Total Profit',
		value: `-4.6532`,
	},
	{
		id: 2,
		name: 'Total Loss',
		value: `56.1375`,
	},
	{
		id: 3,
		name: 'Net Profit/Loss',
		value: `-34.8632`,
	},
	{
		id: 4,
		name: 'Wining Trades',
		value: `5`,
	},
	{
		id: 5,
		name: 'Losing Trades',
		value: `8`,
	},
	{
		id: 6,
		name: 'Winrate',
		value: `56.23`,
	},
]

const levelImages = { hamster, bear, bull, shark, whale }

export const Info = React.memo(() => {
	const { user } = useSelector(state => state.candidate)
	const { color, amount } = useSelector(state => state.settings)

	const currentLevel = useCallback(() => {
		return levelImages[user?.level?.name] || levelImages.hamster
	}, [])

	return (
		<div style={{ marginBottom: 'auto' }}>
			<OuterBlock>
				<div className={styles.info_wrapper}>
					<div className={styles.info_level}>
						<InnerBlock>
							<img src={currentLevel()} alt='level-image' />
						</InnerBlock>
					</div>

					<div className={styles.info_stats}>
						<div className={styles.info_stats_head}>
							<H2>
								<span>Overview wallet</span>
							</H2>

							<SharedButton popup={<SharedDashboardPopup />} />
						</div>

						<ul>
							{statsList &&
								statsList.length > 0 &&
								statsList.map(stat => (
									<li key={stat?.id}>
										<RootDesc>
											<span>{stat?.name}</span>
										</RootDesc>

										<RootDesc>
											{stat?.id === 0 ? (
												<>
													<b
														style={
															color
																? {
																		color: `var(--${
																			stat?.value.includes('-')
																				? 'red'
																				: 'green'
																		})`,
																  }
																: {}
														}
													>
														{amount ? '******' : stat?.value}{' '}
													</b>
													<b>USDT</b>
												</>
											) : stat?.id === 4 || stat?.id === 5 ? (
												<span>{amount ? '****' : stat?.value}</span>
											) : stat?.id === 6 ? (
												<>
													<span>{amount ? '***' : stat?.value} </span>
													<span>%</span>
												</>
											) : (
												<>
													<span
														style={
															color
																? {
																		color: `var(--${
																			stat?.value.includes('-')
																				? 'red'
																				: 'green'
																		})`,
																  }
																: {}
														}
													>
														{amount ? '******' : stat?.value}{' '}
													</span>
													<span>USDT</span>
												</>
											)}
										</RootDesc>
									</li>
								))}
						</ul>
					</div>
				</div>
			</OuterBlock>
		</div>
	)
})
