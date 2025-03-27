import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { capitalize } from '@/helpers/functions'
import React, { useCallback, useEffect } from 'react'
import {
	clearPositions,
	getBybitPositions,
	setPage,
	setSort,
} from '@/redux/slices/positionsSlice'

import { PageLayout } from '@/components/layouts/PageLayout'
import { TableLayout } from '@/components/layouts/TableLayout'
import { ControlButton } from '@/components/ui/buttons/ControlButton'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { Mark } from '@/components/ui/general/Mark'
import { BarChart } from './BarChart'
import { SharedButton } from '@/components/ui/buttons/SharedButton'
import { SharedPositionPopup } from '@/popups/SharedPositionPopup'
import { Loader } from '@/components/ui/general/Loader'

export const DiaryPage = React.memo(() => {
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { mark, color, amount } = useSelector(state => state.settings)
	const { exchange, search, limit } = useSelector(state => state.filters)
	const {
		positions,
		fakePositions,
		totalPages,
		page,
		sort,
		serverStatus,
		errorMessage,
	} = useSelector(state => state.positions)

	const columns = [
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
							? { color: `var(--${value.includes < 0 ? 'red' : 'green'})` }
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
						disabled={fakePositions}
						onClickBtn={() => handleClickView(row.original)}
					/>

					<SharedButton
						disabled={fakePositions}
						popup={<SharedPositionPopup />}
					/>
				</div>
			),
			width: 130,
		},
	]

	const goToPage = pageIndex => {
		dispatch(setPage(pageIndex + 1))
	}

	const sortBy = column => {
		if (sort.type === column.id) {
			dispatch(
				setSort({
					type: column.id,
					value: sort.value === 'asc' ? 'desc' : 'asc',
				})
			)
		} else {
			dispatch(setSort({ type: column.id, value: 'desc' }))
		}
	}

	const handleClickUpdate = () => {
		dispatch(
			getBybitPositions({
				exchange: exchange.name,
				sort,
				search,
				page,
				limit,
			})
		)
	}

	const handleClickView = useCallback(
		item => {
			const id = item?.id

			navigate(`/diary/position/${id}`, { state: { item } })
		},
		[navigate]
	)

	useEffect(() => {
		dispatch(setPage(1))
	}, [search, limit, exchange, sort])

	useEffect(() => {
		dispatch(
			getBybitPositions({
				exchange: exchange.name,
				sort,
				search,
				page,
				limit,
			})
		)
	}, [search, limit, exchange, sort, page])

	useEffect(() => {
		return () => {
			dispatch(clearPositions())
		}
	}, [location])

	return (
		<PageLayout
			update={handleClickUpdate}
			chartWidth={700}
			search={true}
			entries={true}
			total={true}
		>
			{serverStatus === 'loading' && <Loader />}

			<div style={{ width: '100%' }}>
				<TableLayout
					columns={columns}
					fakeData={fakePositions}
					data={positions}
					totalPages={totalPages}
					error={errorMessage}
					serverStatus={serverStatus}
					page={page}
					toPage={goToPage}
					sortBy={sortBy}
					emptyWarn={'There were no open transactions now!'}
				/>
			</div>

			<OuterBlock>
				<BarChart />
			</OuterBlock>
		</PageLayout>
	)
})
