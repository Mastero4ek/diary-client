import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip,
	Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import React, { useMemo } from 'react'
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

const generateRandomData = length => {
	return Array.from({ length }, () => Math.floor(Math.random() * 1000))
}

export const LineChart = React.memo(() => {
	const { theme, width, isMobile } = useSelector(state => state.settings)
	const { date } = useSelector(state => state.filters)
	const { fakeWallet } = useSelector(state => state.wallet)

	const margin = (width * 0.5) / 100
	const fontSize = (width * 0.9) / 100
	const border = (width * 0.25) / 100
	const font = "'IBM Plex Sans', sans-serif"
	const colorDark = 'rgba(185, 200, 215, 1)'
	const colorLight = 'rgba(79, 104, 137, 1)'

	const data = useMemo(
		() => ({
			labels: [date.start_date, date.end_date],
			datasets: [
				{
					label: 'Profit in USDT',
					data: generateRandomData(12),
					borderColor: theme ? '#24eaa4' : '#c270f8',
					pointBackgroundColor: theme ? '#24eaa4' : '#c270f8',
					fill: false,
					tension: 0.35,
				},
			],
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
		]
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
