import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageLayout } from '@/components/layouts/PageLayout'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { Info } from './Info'
import { LineChart } from './LineChart'
import { getBybitWallet } from '@/redux/slices/walletSlice'
import { Loader } from '@/components/ui/general/Loader'

export const DashboardPage = React.memo(() => {
	const { exchange, date } = useSelector(state => state.filters)
	const dispatch = useDispatch()
	const { serverStatus } = useSelector(state => state.wallet)

	const handleClickUpdate = useCallback(() => {
		dispatch(
			getBybitWallet({
				exchange: exchange.name,
				start_time: date.start_date,
				end_time: date.end_date,
			})
		)
	}, [exchange, date])

	useEffect(() => {
		dispatch(
			getBybitWallet({
				exchange: exchange.name,
				start_time: date.start_date,
				end_time: date.end_date,
			})
		)
	}, [exchange, date])

	return (
		<PageLayout
			chartWidth={720}
			update={handleClickUpdate}
			periods={true}
			calendar={true}
		>
			{serverStatus === 'loading' && <Loader />}
			<Info />

			<OuterBlock>
				<LineChart />
			</OuterBlock>
		</PageLayout>
	)
})
