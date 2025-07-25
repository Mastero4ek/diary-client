import React, { useCallback, useEffect } from 'react'

import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import avatarDefault from '@/assets/images/general/default_avatar.png'
import { PageLayout } from '@/components/layouts/PageLayout'
import { DescLayout } from '@/components/layouts/PageLayout/DescLayout'
import { usePopup } from '@/components/layouts/PopupLayout/PopupProvider'
import { TableLayout } from '@/components/layouts/TableLayout'
import { ControlButton } from '@/components/ui/buttons/ControlButton'
import { RootButton } from '@/components/ui/buttons/RootButton'
import { ClosedContent } from '@/components/ui/general/ClosedContent'
import { CountdownTimer } from '@/components/ui/general/CountdownTimer'
import { InnerBlock } from '@/components/ui/general/InnerBlock'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { capitalize } from '@/helpers/functions'
import { NewTournamentPopup } from '@/popups/NewTournamentPopup'
import { getUser } from '@/redux/slices/candidateSlice'
import {
	addTournamentUser,
	clearTournaments,
	deleteTournament,
	getTournament,
	removeTournamentUser,
	setErrorMessage,
	setPage,
} from '@/redux/slices/tournamentSlice'

import styles from './styles.module.scss'

export const BattlePage = () => {
	const { openPopup } = usePopup()
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
					style={{
						width: '40rem',
						height: '40rem',
						borderRadius: '50%',
						objectFit: 'cover',
					}}
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

					{user?.role === 'admin' && (
						<div className={styles.battle_delete_button}>
							<ControlButton
								disabled={fakeUsers}
								icon={'cross'}
								onClickBtn={() => handleClickDelete(row.original)}
							/>
						</div>
					)}
				</div>
			),
			width: 130,
		},
	]

	const goToPage = pageIndex => {
		dispatch(setPage(pageIndex + 1))
	}

	const handleClickDelete = useCallback(
		item => {
			dispatch(
				removeTournamentUser({ tournamentId: tournament._id, userId: item.id })
			).then(() => {
				dispatch(
					getTournament({
						exchange: exchange.name,
						page,
						size: limit,
						search,
					})
				)
			})
		},
		[dispatch, tournament, exchange.name, page, limit, search]
	)

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

	const handleClickNewTournament = useCallback(() => {
		openPopup(<NewTournamentPopup />)
	}, [])

	const handleClickDeleteTournament = useCallback(async () => {
		if (!tournament?._id) return

		const result = await dispatch(deleteTournament(tournament._id))

		if (result.meta.requestStatus !== 'fulfilled') {
			dispatch(setErrorMessage(result.payload.message))
		}
	}, [dispatch, tournament])

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

			if (user?.id) {
				dispatch(getUser(user.id))
			}
		}
	}, [location, dispatch, user?.id])

	const registrationClosed = moment(tournament?.registration_date).isBefore(
		moment()
	)
	const alreadyJoined =
		users &&
		users.length > 0 &&
		users.some(participant => participant.id === user.id)

	return (
		<PageLayout
			update={handleClickUpdate}
			chartWidth={600}
			entries={true}
			search={true}
		>
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
						tournament?.name ? (
							tournament?.name || ''
						) : (
							<>
								Take part in the tournament <br /> for the title of the best
								trader
							</>
						)
					}
					description={
						tournament?.description ? (
							tournament?.description || ''
						) : (
							<>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Explicabo, provident unde! Quasi repellendus enim minus
								blanditiis dolore, saepe eligendi suscipit a nostrum sit,
								deleniti in commodi nemo perferendis, error qui?
							</>
						)
					}
				>
					{tournament?.cover && (
						<div className={styles.battle_cover}>
							<InnerBlock>
								<img src={tournament?.cover} alt='tournament' />
							</InnerBlock>
						</div>
					)}

					{tournament?.registration_date && (
						<div className={styles.battle_desc_bottom}>
							<CountdownTimer
								targetDate={tournament ? tournament?.start_date : new Date()}
							/>
						</div>
					)}

					<div className={styles.battle_desc_bottom_buttons}>
						{user?.role === 'admin' && tournament?.name && (
							<div className={styles.battle_desc_bottom_button_delete}>
								<RootButton
									disabled={fakeUsers}
									icon={'cross'}
									text={'Delete tournament'}
									onClickBtn={handleClickDeleteTournament}
								/>
							</div>
						)}

						{user?.role === 'admin' && !tournament?.name && (
							<RootButton
								disabled={fakeUsers}
								onClickBtn={handleClickNewTournament}
								text={'New tournament'}
								icon={'join'}
							/>
						)}

						{tournament?.registration_date && (
							<RootButton
								disabled={alreadyJoined || registrationClosed || fakeUsers}
								onClickBtn={handleClickJoin}
								text={'Join'}
								icon={'join'}
							>
								{(alreadyJoined || registrationClosed) && (
									<ClosedContent
										title={
											alreadyJoined
												? 'You have already joined this tournament!'
												: registrationClosed
												? 'Registration is closed!'
												: ''
										}
										width={30}
									/>
								)}
							</RootButton>
						)}
					</div>
				</DescLayout>
			</OuterBlock>
		</PageLayout>
	)
}
