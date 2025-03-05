import React, { useCallback } from 'react'

import { PageLayout } from '@/components/layouts/PageLayout'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { Info } from './Info'
import { LineChart } from './LineChart'

export const DashboardPage = React.memo(() => {
	const handleClickUpdate = useCallback(() => {
		console.log('update user wallet')
	}, [])

	return (
		<PageLayout
			chartWidth={720}
			update={handleClickUpdate}
			periods={true}
			calendar={true}
		>
			{/* <Loader /> */}
			<Info />

			<OuterBlock>
				<LineChart />
			</OuterBlock>
		</PageLayout>
	)
})
