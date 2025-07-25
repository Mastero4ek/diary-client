import React, { useCallback, useEffect } from 'react'

import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { PageLayout } from '@/components/layouts/PageLayout'
import { DescLayout } from '@/components/layouts/PageLayout/DescLayout'
import { TableLayout } from '@/components/layouts/TableLayout'
import { ControlButton } from '@/components/ui/buttons/ControlButton'
import { Loader } from '@/components/ui/general/Loader'
import { Mark } from '@/components/ui/general/Mark'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { capitalize } from '@/helpers/functions'
import {
	clearOrders,
	getBybitSavedOrders,
	removedOrder,
	setPage,
	setSort,
} from '@/redux/slices/bookmarksOrdersSlice'

import styles from './styles.module.scss'

export const BookmarksPage = React.memo(() => {
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { mark, color, amount } = useSelector(state => state.settings)
	const { date, limit, search, exchange } = useSelector(state => state.filters)
	const { user } = useSelector(state => state.candidate)
	const {
		orders,
		fakeOrders,
		totalPages,
		sort,
		page,
		errorMessage,
		serverStatus,
	} = useSelector(state => state.bookmarks)

	const columns = [
		{ Header: 'Symbol', accessor: 'symbol' },
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
						disabled={fakeOrders}
						onClickBtn={() => handleClickView(row.original)}
					/>

					<div className={styles.bookmarks_delete_button}>
						<ControlButton
							icon={'cross'}
							disabled={fakeOrders}
							onClickBtn={() => handleClickRemove(row.original)}
						/>
					</div>
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
			getBybitSavedOrders({
				sort,
				search,
				page,
				limit,
				start_time: date.start_date,
				end_time: date.end_date,
				exchange: exchange.name,
			})
		)
	}

	const handleClickView = useCallback(
		item => {
			const id = item?.id

			navigate(`/bookmarks/position/${id}`, { state: { item } })
		},
		[navigate]
	)

	const handleClickRemove = useCallback(
		item => {
			dispatch(
				removedOrder({
					order: item,
					exchange: exchange.name,
					start_time: date.start_date,
					end_time: date.end_date,
				})
			).then(() => {
				dispatch(
					getBybitSavedOrders({
						sort,
						search,
						page,
						limit,
						start_time: date.start_date,
						end_time: date.end_date,
						exchange: exchange.name,
					})
				)
			})
		},
		[
			dispatch,
			exchange.name,
			date.start_date,
			date.end_date,
			sort,
			search,
			page,
			limit,
		]
	)

	useEffect(() => {
		getBybitSavedOrders
		dispatch(
			getBybitSavedOrders({
				sort,
				search,
				page,
				limit,
				start_time: date.start_date,
				end_time: date.end_date,
				exchange: exchange.name,
			})
		)
	}, [dispatch, date, page, limit, sort, search])

	useEffect(() => {
		if (orders.length === 0 && serverStatus === 'success') {
			dispatch(setPage(1))
		}
	}, [orders])

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
					data={orders}
					fakeData={fakeOrders}
					totalPages={totalPages}
					error={errorMessage}
					serverStatus={serverStatus}
					toPage={goToPage}
					page={page}
					sortBy={sortBy}
					emptyWarn={'There were no saved transactions during this period!'}
				/>
			</div>

			<OuterBlock>
				<DescLayout
					icon={'mark'}
					title={
						<>
							Save and analyze <br /> transactions
						</>
					}
					description={
						<>
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse,
							maxime porro harum quidem obcaecati nisi rem in voluptas corrupti
							alias sunt quis numquam qui rerum, voluptatem sed aperiam iure
							impedit. Cum aliquam libero veniam, dolorum est quod minima eum
							alias dolores? Nisi in nesciunt consequatur similique asperiores
							facere autem porro molestias consequuntur aperiam et assumenda,
							dolore ea mollitia a iste.
						</>
					}
				/>
			</OuterBlock>
		</PageLayout>
	)
})
