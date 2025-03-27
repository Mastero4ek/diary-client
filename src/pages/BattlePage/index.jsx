import { capitalize } from '@/helpers/functions'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useCallback, useEffect, useMemo } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'

import {
	getTournament,
	addTournamentUser,
	setPage,
	clearTournaments,
} from '@/redux/slices/tournamentSlice'

import { PageLayout } from '@/components/layouts/PageLayout'
import { TableLayout } from '@/components/layouts/TableLayout'
import { ControlButton } from '@/components/ui/buttons/ControlButton'
import { RootButton } from '@/components/ui/buttons/RootButton'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { DescLayout } from '@/components/layouts/PageLayout/DescLayout'
import { CountdownTimer } from '@/components/ui/general/CountdownTimer'
import { Loader } from '@/components/ui/general/Loader'
import { ClosedContent } from '@/components/ui/general/ClosedContent'
import { InnerBlock } from '@/components/ui/general/InnerBlock'

import avatarDefault from '@/assets/images/general/default_avatar.png'
import styles from './styles.module.scss'

export const BattlePage = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { color, amount } = useSelector(state => state.settings)
	const { search, limit } = useSelector(state => state.filters)
	const {
		tournament,
		fakeUsers,
		users,
		serverStatus,
		errorMessage,
		page,
		totalPages,
	} = useSelector(state => state.tournaments)
	const { user } = useSelector(state => state.candidate)
	const { exchange } = useSelector(state => state.filters)

	const columns = [
		{
			Header: 'Avatar',
			accessor: 'cover',
			Cell: ({ cell: { value } }) => (
				<img
					src={value || avatarDefault}
					alt='avatar'
					style={{ width: '40rem', height: '40rem', borderRadius: '50%' }}
				/>
			),
			width: 100,
		},
		{ Header: 'Name', accessor: 'name', width: '100%' },
		{
			Header: 'Level',
			accessor: 'level',
			Cell: ({ cell: { value } }) => <>{capitalize(value.name)}</>,
			width: '100%',
		},
		{
			Header: 'Score',
			accessor: 'level.value',
			Cell: ({ cell: { value } }) => <>{value}</>,
			width: '100%',
		},
		{
			Header: 'Roe%',
			accessor: 'roe',
			Cell: ({ cell: { value = '0.0000' } }) => (
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
						disabled={fakeUsers}
						icon={'view'}
						onClickBtn={() => handleClickView(row.original)}
					/>
					<ControlButton
						disabled={fakeUsers}
						icon={'challenge'}
						onClickBtn={() => handleClickBattle(row.original)}
					/>
				</div>
			),
			width: 130,
		},
	]

	const goToPage = pageIndex => {
		dispatch(setPage(pageIndex + 1))
	}

	const handleClickUpdate = () => {
		dispatch(
			getTournament({
				exchange: exchange.name,
				page,
				size: limit,
				search,
			})
		)
	}

	const handleClickView = useCallback(
		item => {
			const id = item?.id

			navigate(`/battle/users/${id}`, { state: { item } })
		},
		[navigate]
	)

	const handleClickBattle = useCallback(item => {
		console.log('Battle clicked:', item)
	}, [])

	const handleClickJoin = useCallback(() => {
		dispatch(
			addTournamentUser({
				exchange: capitalize(exchange.name),
				email: user.email,
			})
		)
	}, [dispatch, exchange.name, user.email])

	useEffect(() => {
		dispatch(
			getTournament({
				exchange: exchange.name,
				page,
				size: limit,
				search,
			})
		)
	}, [exchange.name, limit, page, search])

	useEffect(() => {
		return () => {
			dispatch(clearTournaments())
		}
	}, [location, dispatch])

	return (
		<PageLayout
			update={handleClickUpdate}
			chartWidth={600}
			entries={true}
			search={true}
		>
			{serverStatus === 'loading' && <Loader />}

			<div style={{ width: '100%' }}>
				<TableLayout
					error={errorMessage}
					serverStatus={serverStatus}
					toPage={goToPage}
					totalPages={totalPages}
					page={page}
					columns={columns}
					data={users}
					emptyWarn={'No tournament participants found for this tournament!'}
					sortBy={() => {}}
					fakeData={fakeUsers}
				/>
			</div>

			<OuterBlock>
				<DescLayout
					icon={'cup'}
					title={
						<>
							Take part in the tournament <br /> for the title of the best
							trader
						</>
					}
					description={
						<>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit.
							Explicabo, provident unde! Quasi repellendus enim minus blanditiis
							dolore, saepe eligendi suscipit a nostrum sit, deleniti in commodi
							nemo perferendis, error qui?
						</>
					}
				>
					{tournament?.registration_date && (
						<div className={styles.battle_desc_bottom}>
							<CountdownTimer
								targetDate={tournament ? tournament?.start_date : new Date()}
							/>

							{tournament?.registration_date ? (
								<RootButton
									onClickBtn={handleClickJoin}
									text={'Join'}
									icon={'join'}
								/>
							) : (
								<InnerBlock>
									<div
										style={{
											width: '50rem',
											height: '50rem',
											position: 'relative',
											borderRadius: '50%',
										}}
									>
										<ClosedContent width={30} />
									</div>
								</InnerBlock>
							)}
						</div>
					)}
				</DescLayout>
			</OuterBlock>
		</PageLayout>
	)
}
