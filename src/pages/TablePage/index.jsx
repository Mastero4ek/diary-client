import { useDispatch, useSelector } from 'react-redux'
import { capitalize } from '@/helpers/functions'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { unwrapResult } from '@reduxjs/toolkit'

import {
	getBybitOrdersPnl,
	setPage,
	setSort,
	clearOrders,
} from '@/redux/slices/ordersSlice'
import { savedOrder } from '@/redux/slices/bookmarksOrdersSlice'

import { PageLayout } from '@/components/layouts/PageLayout'
import { TableLayout } from '@/components/layouts/TableLayout'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { ControlButton } from '@/components/ui/buttons/ControlButton'
import { Mark } from '@/components/ui/general/Mark'
import { DoughnutChart } from './DougnutChart'
import { Loader } from '@/components/ui/general/Loader'

export const TablePage = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [bookmarkOrders, setBookmarkOrders] = useState([])
	const { mark, color, amount } = useSelector(state => state.settings)
	const { date, limit, search, exchange } = useSelector(state => state.filters)
	const { user } = useSelector(state => state.candidate)
	const {
		fakeOrders,
		orders,
		bookmarks,
		totalPages,
		sort,
		page,
		errorMessage,
		serverStatus,
	} = useSelector(state => state.orders)

	const columns = [
		{ Header: 'Symbol', accessor: 'symbol', width: '100%' },
		{
			Header: 'Time',
			accessor: 'closed_time',
			Cell: ({ cell: { value } }) => (
				<span>{moment(value).format('DD/MM/YYYY')}</span>
			),
			width: '100%',
		},
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
		{
			Header: 'Qty',
			accessor: 'quality',
			Cell: ({ cell: { value } }) => <>{amount ? '****' : value}</>,
			width: '100%',
		},
		{
			Header: 'Margin',
			accessor: 'margin',
			Cell: ({ cell: { value } }) => <>{amount ? '****' : value}</>,
			width: '100%',
		},
		{
			Header: 'Pnl',
			accessor: 'pnl',
			Cell: ({ cell: { value } }) => (
				<span
					style={
						color ? { color: `var(--${value < 0 ? 'red' : 'green'})` } : {}
					}
				>
					{amount ? '****' : value}
				</span>
			),
			width: '100%',
		},
		{
			Header: 'Roe%',
			accessor: 'roe',
			Cell: ({ cell: { value } }) => (
				<span
					style={
						color ? { color: `var(--${value < 0 ? 'red' : 'green'})` } : {}
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
			Cell: ({ row }) => {
				const isBookmarked = bookmarks.some(
					bookmark => bookmark.id === row.original.id
				)
				const isBookmarkedNow = bookmarkOrders.some(
					bookmark => bookmark === row.original.id
				)

				return (
					<div
						style={{
							display: 'flex',
							gap: '15rem',
							justifyContent: 'flex-end',
						}}
					>
						<ControlButton
							icon={'view'}
							disabled={fakeOrders}
							onClickBtn={() => handleClickView(row.original)}
						/>

						<ControlButton
							icon={'save'}
							disabled={fakeOrders || isBookmarked || isBookmarkedNow}
							animate={isBookmarkedNow}
							onClickBtn={() => handleClickSave(row.original)}
						/>
					</div>
				)
			},
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
			getBybitOrdersPnl({
				exchange: exchange.name,
				sort,
				search,
				page,
				limit,
				start_time: date.start_date,
				end_time: date.end_date,
			})
		)
	}

	const handleClickView = useCallback(
		item => {
			const id = item?.id

			navigate(`/table/position/${id}`, { state: { item } })
		},
		[navigate]
	)

	const handleClickSave = useCallback(
		async item => {
			try {
				const resultAction = await dispatch(
					savedOrder({ order: item, exchange: exchange.name })
				)
				const originalPromiseResult = unwrapResult(resultAction)
				if (!originalPromiseResult) return

				setBookmarkOrders(prevOrders => [
					...prevOrders,
					originalPromiseResult.order.id,
				])
			} catch (rejectedValueOrSerializedError) {
				console.log(rejectedValueOrSerializedError)
			}
		},
		[dispatch, user.email, exchange.name]
	)

	useEffect(() => {
		dispatch(setPage(1))
	}, [date, search, limit, exchange, sort])

	useEffect(() => {
		dispatch(
			getBybitOrdersPnl({
				exchange: exchange.name,
				sort,
				search,
				page,
				limit,
				start_time: date.start_date,
				end_time: date.end_date,
			})
		)
	}, [date, search, limit, exchange, sort, page])

	useEffect(() => {
		return () => {
			dispatch(clearOrders())
		}
	}, [location])

	return (
		<PageLayout
			chartWidth={460}
			update={handleClickUpdate}
			periods={true}
			calendar={true}
			search={true}
			entries={true}
		>
			{serverStatus === 'loading' && <Loader />}

			<div style={{ width: '100%' }}>
				<TableLayout
					columns={columns}
					fakeData={fakeOrders}
					data={orders}
					totalPages={totalPages}
					error={errorMessage}
					serverStatus={serverStatus}
					page={page}
					toPage={goToPage}
					sortBy={sortBy}
					emptyWarn={'There were no closed transactions during this period!'}
				/>
			</div>

			<OuterBlock>
				<DoughnutChart />
			</OuterBlock>
		</PageLayout>
	)
}
