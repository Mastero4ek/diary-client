import React, { useCallback, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { PageLayout } from '@/components/layouts/PageLayout'
import { Loader } from '@/components/ui/general/Loader'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { getProfitByDay } from '@/redux/slices/walletSlice'

import { Info } from './Info'
import { LineChart } from './LineChart'

export const DashboardPage = React.memo(() => {
	const { exchange, date } = useSelector(state => state.filters)
	const dispatch = useDispatch()
	const { serverStatus } = useSelector(state => state.wallet)

	const handleClickUpdate = useCallback(() => {
		dispatch(
			getProfitByDay({
				exchange: exchange.name,
				start_time: date.start_date,
				end_time: date.end_date,
			})
		)
	}, [exchange, date])

	useEffect(() => {
		dispatch(
			getProfitByDay({
				exchange: exchange.name,
				start_time: date.start_date,
				end_time: date.end_date,
			})
		)
	}, [exchange, date])

	return (
		<PageLayout chartWidth={720} update={handleClickUpdate} periods={true}>
			{serverStatus === 'loading' && <Loader />}
			<Info />

			<OuterBlock>
				<LineChart />
			</OuterBlock>
		</PageLayout>
	)
})
