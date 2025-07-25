import React, { useMemo } from 'react'

import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Tooltip,
} from 'chart.js'
import _ from 'lodash'
import moment from 'moment'
import { Line } from 'react-chartjs-2'
import { useSelector } from 'react-redux'

import styles from './styles.module.scss'

ChartJS.register(
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Legend,
	Tooltip,
	Filler
)

export const LineChart = React.memo(() => {
	const { theme, width, isMobile } = useSelector(state => state.settings)
	const { profitByDay, fakeWallet } = useSelector(state => state.wallet)
	const { filter } = useSelector(state => state.filters)

	const margin = (width * 0.5) / 100
	const fontSize = (width * 0.9) / 100
	const border = (width * 0.25) / 100
	const font = "'IBM Plex Sans', sans-serif"
	const colorDark = 'rgba(185, 200, 215, 1)'
	const colorLight = 'rgba(79, 104, 137, 1)'

	const { labels, chartData } = useMemo(() => {
		const now = moment()
		const period = filter?.name?.toLowerCase()
		const groupedData = _.groupBy(profitByDay, item =>
			moment(item.date).format('YYYY-MM-DD')
		)

		let labels = []
		let chartData = []

		switch (period) {
			case 'year': {
				const year = now.year()

				labels = Array.from({ length: 12 }, (_, i) =>
					moment({ year, month: i })
				)

				const monthlyData = _.groupBy(profitByDay, item =>
					moment(item.date).format('YYYY-MM')
				)

				chartData = labels.map(label => {
					const monthKey = label.format('YYYY-MM')

					return (monthlyData[monthKey] || []).reduce(
						(sum, item) => sum + item.profit,
						0
					)
				})

				labels = labels.map(label => label.format('MMM'))
				break
			}

			case 'quarter': {
				const startOfQuarter = now.clone().startOf('quarter')
				const endOfQuarter = now.clone().endOf('quarter')
				const weekLabels = []
				let currentWeek = startOfQuarter.clone().startOf('isoWeek')

				while (currentWeek.isSameOrBefore(endOfQuarter)) {
					weekLabels.push(currentWeek.clone())
					currentWeek.add(1, 'week')
				}

				const weeklyData = _.groupBy(profitByDay, item =>
					moment(item.date).format('GGGG-WW')
				)

				chartData = weekLabels.map(label => {
					const weekKey = label.format('GGGG-WW')

					return (weeklyData[weekKey] || []).reduce(
						(sum, item) => sum + item.profit,
						0
					)
				})

				labels = weekLabels.map(label => `${label.isoWeek()}`)
				break
			}

			case 'month': {
				const startOfMonth = now.clone().startOf('month')
				const endOfMonth = now.clone().endOf('month')
				const daysInMonth = endOfMonth.diff(startOfMonth, 'days') + 1

				labels = Array.from({ length: daysInMonth }, (_, i) =>
					startOfMonth.clone().add(i, 'days')
				)

				chartData = labels.map(label => {
					const dayKey = label.format('YYYY-MM-DD')

					return (groupedData[dayKey] || []).reduce(
						(sum, item) => sum + item.profit,
						0
					)
				})

				labels = labels.map(label => label.format('DD'))
				break
			}

			case 'week':
			default: {
				const startOfWeek = now.clone().startOf('isoWeek')

				labels = Array.from({ length: 7 }, (_, i) =>
					startOfWeek.clone().add(i, 'days')
				)

				chartData = labels.map(label => {
					const dayKey = label.format('YYYY-MM-DD')

					return (groupedData[dayKey] || []).reduce(
						(sum, item) => sum + item.profit,
						0
					)
				})

				labels = labels.map(label => label.format('ddd'))
				break
			}
		}

		return { labels, chartData }
	}, [profitByDay, filter])

	const data = useMemo(
		() => ({
			labels,
			datasets: [
				{
					label: 'Profit in USDT',
					data: chartData,
					borderColor: theme ? '#24eaa4' : '#c270f8',
					pointBackgroundColor: theme ? '#24eaa4' : '#c270f8',
					fill: false,
					tension: 0.35,
				},
			],
		}),
		[labels, chartData, theme]
	)

	const options = useMemo(
		() => ({
			responsive: true,
			animation: {
				duration: fakeWallet ? 0 : 1500,
			},
			elements: {
				line: {
					borderWidth: width >= 1920 || isMobile ? 5 : border,
					capBezierPoints: false,
				},
				point: {
					radius: width >= 1920 || isMobile ? 5 : border,
					borderWidth: 0,
				},
			},
			plugins: {
				legend: {
					position: 'top',
					labels: {
						boxWidth: width >= 1920 || isMobile ? 15 : margin,
						boxHeight: width >= 1920 || isMobile ? 15 : margin,
						usePointStyle: true,
						color: theme ? colorDark : colorLight,
						font: {
							size: width >= 1920 || isMobile ? 14 : fontSize,
							family: font,
						},
					},
				},
				tooltip: {
					backgroundColor: theme
						? 'rgba(38, 46, 54, 0.75)'
						: 'rgba(241, 247, 255, 0.75)',
					titleColor: theme ? colorDark : colorLight,
					bodyColor: theme ? colorDark : colorLight,
					padding: width >= 1920 || isMobile ? 20 : margin,
					caretPadding: width >= 1920 || isMobile ? 20 : margin,
					cornerRadius: width >= 1920 || isMobile ? 20 : margin,
					boxPadding: width >= 1920 || isMobile ? 20 : margin,
					titleAlign: 'center',
					bodyAlign: 'right',
					titleFont: {
						size: width >= 1920 || isMobile ? 16 : fontSize,
						family: font,
					},
					bodyFont: {
						size: width >= 1920 || isMobile ? 14 : fontSize,
						family: font,
					},
					callbacks: {
						label: function (context) {
							const idx = context.dataIndex
							let count = 0
							// Для разных периодов ищем count по ключу
							if (filter?.name?.toLowerCase() === 'year') {
								const month = context.label
								const year = moment().year()
								const monthKey = moment({ year, month: idx }).format('YYYY-MM')
								count = profitByDay
									.filter(
										item => moment(item.date).format('YYYY-MM') === monthKey
									)
									.reduce((acc, item) => acc + (item.count || 0), 0)
							} else if (filter?.name?.toLowerCase() === 'month') {
								const day = context.label
								const month = moment().month()
								const year = moment().year()
								const dayKey = moment({ year, month, day: Number(day) }).format(
									'YYYY-MM-DD'
								)
								count =
									profitByDay.find(
										item => moment(item.date).format('YYYY-MM-DD') === dayKey
									)?.count || 0
							} else {
								// week/quarter/другое
								const dayKey = context.label
								count =
									profitByDay.find(
										item => moment(item.date).format('ddd') === dayKey
									)?.count || 0
							}
							const profit = context.dataset.data[idx]
							const profitRounded =
								typeof profit === 'number' ? profit.toFixed(2) : profit
							return `Profit in USDT: ${profitRounded}, Orders: ${count || 0}`
						},
					},
				},
			},
			scales: {
				x: {
					grid: {
						lineWidth: 0,
						color: theme ? colorDark : colorLight,
					},
					ticks: {
						padding: fontSize,
						color: theme ? colorDark : colorLight,
						font: {
							size: width >= 1920 || isMobile ? 14 : fontSize,
							family: font,
						},
					},
				},
				y: {
					display: false,
				},
			},
		}),
		[
			theme,
			width,
			isMobile,
			fontSize,
			border,
			margin,
			colorDark,
			colorLight,
			fakeWallet,
			profitByDay,
			filter,
		]
	)

	return (
		<div
			className={styles.line_chart}
			style={{
				opacity: `${fakeWallet ? '0.2' : '1'}`,
				pointerEvents: `${fakeWallet ? 'none' : 'auto'}`,
			}}
		>
			<Line data={data} options={options} />
		</div>
	)
})
