import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageLayout } from '@/components/layouts/PageLayout'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { Info } from './Info'
import { LineChart } from './LineChart'
import { getBybitWallet } from '@/redux/slices/walletSlice'
import { Loader } from '@/components/ui/general/Loader'

export const DashboardPage = React.memo(() => {
	const { exchange } = useSelector(state => state.filters)
	const dispatch = useDispatch()
	const { serverStatus } = useSelector(state => state.wallet)

	const handleClickUpdate = useCallback(() => {
		dispatch(getBybitWallet({ exchange: exchange.name }))
	}, [exchange])

	useEffect(() => {
		dispatch(getBybitWallet({ exchange: exchange.name }))
	}, [exchange])

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
