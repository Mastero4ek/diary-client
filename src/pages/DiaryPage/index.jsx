import { useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { capitalize } from '@/helpers/functions'
import React, { useCallback, useMemo } from 'react'

import { PageLayout } from '@/components/layouts/PageLayout'
import { TableLayout } from '@/components/layouts/TableLayout'
import { ControlButton } from '@/components/ui/buttons/ControlButton'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { Mark } from '@/components/ui/general/Mark'
import { PositionLayout } from '@/components/layouts/PositionLayout'
import { BarChart } from './BarChart'
import { SharedButton } from '@/components/ui/buttons/SharedButton'
import { SharedPositionPopup } from '@/popups/SharedPositionPopup'
import { Loader } from '@/components/ui/general/Loader'

export const DiaryPage = React.memo(() => {
	const navigate = useNavigate()
	const { mark, color, amount } = useSelector(state => state.settings)

	const handleClickUpdate = useCallback(() => {
		console.log('update open orders')
	}, [])

	const handleClickView = useCallback(
		item => {
			const id = item?.id

			navigate(`positions/${id}`, { state: { id } })
		},
		[navigate]
	)

	const data = useMemo(
		() => [
			{
				id: 0,
				symbol: 'BTCUSDT',
				direction: 'long',
				leverage: '15',
				profit: '12.7698',
			},
			{
				id: 1,
				symbol: 'ETHUSDT',
				direction: 'short',
				leverage: '3',
				profit: '-1.78',
			},
			{
				id: 2,
				symbol: 'TWTUSDT',
				direction: 'long',
				leverage: '40',
				profit: '65.45',
			},
		],
		[]
	)

	const columns = useMemo(
		() => [
			{ Header: 'Symbol', accessor: 'symbol', width: '100%' },
			{
				Header: 'Direction',
				accessor: 'direction',
				Cell: ({ cell: { value } }) => (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						{mark && <Mark color={value === 'long' ? 'green' : 'red'} />}

						{capitalize(value)}
					</div>
				),
				width: '100%',
			},
			{ Header: 'Leverage', accessor: 'leverage', width: '100%' },
			{
				Header: 'Profit',
				accessor: 'profit',
				Cell: ({ cell: { value } }) => (
					<span
						style={
							color
								? { color: `var(--${value.includes('-') ? 'red' : 'green'})` }
								: {}
						}
					>
						{amount ? '****' : value}
					</span>
				),
				width: '100%',
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				Cell: ({ row }) => (
					<div
						style={{
							display: 'flex',
							gap: '15rem',
							justifyContent: 'flex-end',
						}}
					>
						<ControlButton
							icon={'view'}
							onClickBtn={() => handleClickView(row.original)}
						/>

						<SharedButton popup={<SharedPositionPopup />} />
					</div>
				),
				width: 130,
			},
		],
		[]
	)

	return (
		<PageLayout
			update={handleClickUpdate}
			chartWidth={700}
			search={true}
			entries={true}
			total={true}
		>
			{/* <Loader /> */}

			<div style={{ width: '100%' }}>
				<Routes>
					<Route
						path='positions'
						element={<TableLayout columns={columns} data={data} />}
					/>
					<Route path='positions/:id' element={<PositionLayout />} />
				</Routes>
			</div>

			<OuterBlock>
				<BarChart />
			</OuterBlock>
		</PageLayout>
	)
})
