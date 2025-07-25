import React, { useCallback, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { ClosedContent } from '@/components/ui/general/ClosedContent'
import { Icon } from '@/components/ui/general/Icon'
import { InnerBlock } from '@/components/ui/general/InnerBlock'
import { Logo } from '@/components/ui/general/logo'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { CheckboxSwitch } from '@/components/ui/inputs/CheckboxSwitch'
import { logout } from '@/redux/slices/candidateSlice'
import {
	setIsLoadingTheme,
	setSideBar,
	setTheme,
} from '@/redux/slices/settingsSlice'
import { unwrapResult } from '@reduxjs/toolkit'

import styles from './styles.module.scss'

const themeItem = { name: 'Dark mode', icon: 'theme' }
const logoutItem = { name: 'Logout', icon: 'logout' }

const SideBarItem = React.memo(({ item }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()

	const { theme, sideBar } = useSelector(state => state.settings)
	const { user } = useSelector(state => state.candidate)

	const handleClickItem = useCallback(async () => {
		if (item?.link) {
			navigate(item.link)
		}

		if (item?.icon === 'logout') {
			try {
				const resultAction = await dispatch(logout())
				const originalPromiseResult = unwrapResult(resultAction)

				if (!originalPromiseResult) return

				navigate('/login')
			} catch (rejectedValueOrSerializedError) {
				console.log(rejectedValueOrSerializedError)
			}
		}
	}, [dispatch, location])

	const changeTheme = useCallback(() => {
		const currentTheme = theme === true ? false : true

		dispatch(setIsLoadingTheme(true))
		dispatch(setTheme(currentTheme))

		setTimeout(() => {
			dispatch(setIsLoadingTheme(false))
		}, 2000)
	}, [theme])

	const isActive = location.pathname.includes(item?.icon)
	const ItemBlock = isActive ? InnerBlock : OuterBlock

	return (
		<ItemBlock>
			{item?.link &&
				item?.link.includes('battle') &&
				user?.role !== 'admin' && <ClosedContent width={20} />}

			<div
				onClick={
					item?.link && item?.link.includes('battle') && user?.role !== 'admin'
						? undefined
						: handleClickItem
				}
				className={`${item?.icon === 'theme' ? styles.item_theme : ''} ${
					styles.sidebar_body_item
				} ${isActive ? styles.active : ''}`}
			>
				<Icon id={item?.icon} />

				{(sideBar.open || sideBar.blocked_value === 'open') && (
					<div className={styles.sidebar_item_desc}>
						<RootDesc>
							<span>{item?.name}</span>
						</RootDesc>

						{item?.icon === 'theme' && (
							<div style={{ marginLeft: 'auto' }}>
								<CheckboxSwitch
									name={'theme'}
									onSwitch={changeTheme}
									checked={theme}
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</ItemBlock>
	)
})

export const SideBarLayout = React.memo(() => {
	const dispatch = useDispatch()
	const { user } = useSelector(state => state.candidate)
	const { sideBar } = useSelector(state => state.settings)

	const sideBarItems = [
		{ id: 0, name: 'Dashboard', link: '/dashboard', icon: 'dashboard' },
		{ id: 1, name: 'Diary', link: '/diary/positions', icon: 'diary' },
		{ id: 2, name: 'Table', link: '/table/positions', icon: 'table' },
		{
			id: 3,
			name: 'Bookmarks',
			link: '/bookmarks/positions',
			icon: 'bookmarks',
		},
		{ id: 4, name: 'Battle', link: '/battle/users', icon: 'battle' },
		user?.role === 'admin' && {
			id: 5,
			name: 'Users',
			link: '/all-users',
			icon: 'all-users',
		},
		{ id: 6, name: 'Profile', link: '/profile', icon: 'profile' },
		{ id: 7, name: 'Settings', link: '/settings', icon: 'settings' },
		{ id: 8, name: 'Contacts', link: '/contacts', icon: 'contacts' },
	]

	useEffect(() => {
		if (sideBar.blocked_value === 'unblock') {
			dispatch(setSideBar({ ...sideBar, open: false }))
		}
	}, [])

	return (
		<div
			onMouseEnter={() =>
				sideBar.blocked_value === 'unblock' &&
				dispatch(setSideBar({ ...sideBar, open: true }))
			}
			onMouseLeave={() =>
				sideBar.blocked_value === 'unblock' &&
				dispatch(setSideBar({ ...sideBar, open: false }))
			}
			className={`${styles.sidebar_wrapper} ${
				sideBar.open || sideBar.blocked_value === 'open'
					? styles.sidebar_open
					: ''
			}`}
		>
			<div className={styles.sidebar_header}>
				<Logo desc={sideBar.open || sideBar.blocked_value === 'open'} />
			</div>

			<ul className={styles.sidebar_body}>
				{sideBarItems.map(
					item =>
						item && (
							<li key={item.id}>
								<SideBarItem item={item} />
							</li>
						)
				)}
			</ul>

			<div className={styles.sidebar_footer}>
				<SideBarItem item={themeItem} />
				<SideBarItem item={logoutItem} />
			</div>
		</div>
	)
})
