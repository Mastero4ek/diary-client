import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import React, { useCallback } from 'react'
import Cookies from 'js-cookie'
import {
	setTheme,
	setLanguage,
	setIsLoadingTheme,
} from '@/redux/slices/settingsSlice'

import { usePopup } from '../PopupLayout/PopupProvider'
import { SignInPopup } from '@/popups/SignInPopup'
import { Logo } from '@/components/ui/general/Logo'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { RootButton } from '@/components/ui/buttons/RootButton'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { InnerBlock } from '@/components/ui/general/InnerBlock'
import { Exchange } from './Exchange'
import { CheckboxSwitch } from '@/components/ui/inputs/CheckboxSwitch'

import avatarDefault from '@/assets/images/general/default_avatar.png'
import styles from './styles.module.scss'

export const HeaderLayout = React.memo(() => {
	const dispatch = useDispatch()
	const location = useLocation()
	const { openPopup } = usePopup()
	const { theme, language } = useSelector(state => state.settings)
	const { isAuth, user } = useSelector(state => state.candidate)

	const languageList = ['ru', 'en']

	const handleSignIn = useCallback(() => {
		openPopup(<SignInPopup />)
	})

	const changeTheme = useCallback(async () => {
		const currentTheme = theme === true ? false : true

		dispatch(setIsLoadingTheme(true))
		dispatch(setTheme(currentTheme))

		setTimeout(() => {
			dispatch(setIsLoadingTheme(false))
		}, 2000)
	}, [dispatch, theme])

	const changeLanguage = useCallback(
		value => {
			document.documentElement.setAttribute('lang', value)
			Cookies.set('language', value)

			dispatch(setLanguage(value))
		},
		[dispatch, language]
	)

	const renderUserSection = () => (
		<div className={styles.header_user_wrapper}>
			<OuterBlock>
				<div className={styles.header_user}>
					<RootDesc>
						<span>{`${user?.last_name} ${user?.name}` || 'User_name'}</span>
					</RootDesc>

					<div className={styles.header_avatar}>
						<img src={user?.cover || avatarDefault} alt='avatar' />
					</div>
				</div>
			</OuterBlock>
		</div>
	)

	const renderSignInButton = () => (
		<div className={styles.header_settings}>
			<ul className={styles.header_language}>
				{languageList &&
					languageList.length > 0 &&
					languageList.map(lang => {
						const ItemBlock = language === lang ? InnerBlock : OuterBlock

						return (
							<li key={lang}>
								<RootDesc>
									<ItemBlock>
										<b
											style={
												language === lang
													? {
															color: 'var(--primaryDef)',
															pointerEvents: 'none',
													  }
													: {}
											}
											onClick={() => changeLanguage(lang)}
										>
											{lang}
										</b>
									</ItemBlock>
								</RootDesc>
							</li>
						)
					})}
			</ul>

			<CheckboxSwitch
				icons={true}
				name={'theme'}
				onSwitch={changeTheme}
				checked={theme}
			/>

			<RootButton onClickBtn={handleSignIn} text={'Sign in'} icon='sign-in' />
		</div>
	)

	return (
		<div style={isAuth && user.is_activated ? { paddingRight: '40rem' } : {}}>
			<div className={styles.header_wrapper}>
				{isAuth && user.is_activated ? (
					!(
						location.pathname.includes('profile') ||
						location.pathname.includes('settings') ||
						location.pathname.includes('contacts')
					) && <Exchange />
				) : (
					<div className={styles.header_logo}>
						<Logo />
					</div>
				)}

				{isAuth && user.is_activated
					? renderUserSection()
					: renderSignInButton()}
			</div>
		</div>
	)
})
