import styles from './styles.module.scss'

import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title)

const generateRandomData = length => {
	return Array.from({ length }, () => Math.floor(Math.random() * 500))
}

export const BarChart = React.memo(() => {
	const { theme, width, isMobile } = useSelector(state => state.settings)

	let margin = (width * 0.5) / 100
	let fontSize = (width * 0.9) / 100
	let font = "'IBM Plex Sans', sans-serif"
	let colorDark = 'rgba(185, 200, 215, 1)'
	let colorLight = 'rgba(79, 104, 137, 1)'
	let backgroundLight = '#28d5ca'
	let backgroundDark = '#11958d'

	const data = useMemo(
		() => ({
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			datasets: [
				{
					label: 'Profit (PNL)',
					data: generateRandomData(7),
					backgroundColor: [theme ? backgroundDark : backgroundLight],
					borderRadius: margin,
					borderWidth: 0,
					barPercentage: 0.5,
				},
			],
		}),
		[theme, backgroundDark, backgroundLight, margin]
	)

	const options = useMemo(
		() => ({
			responsive: true,
			animation: {
				duration: 1500,
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
					titleColor: theme
						? 'rgba(185, 200, 215, 1)'
						: 'rgba(79, 104, 137, 1)',
					bodyColor: theme ? 'rgba(185, 200, 215, 1)' : 'rgba(79, 104, 137, 1)',
					usePointStyles: true,
					padding: width >= 1920 || isMobile ? 20 : margin,
					caretPadding: width >= 1920 || isMobile ? 20 : margin,
					cornerRadius: width >= 1920 || isMobile ? 20 : margin,
					boxPadding: width >= 1920 || isMobile ? 20 : margin,
					usePointStyle: true,
					titleAlign: 'center',
					bodyAlign: 'right',
					titleFont: {
						size: width >= 1920 || isMobile ? 16 : fontSize,
						family: "'IBM Plex Sans', sans-serif",
					},
					bodyFont: {
						size: width >= 1920 || isMobile ? 14 : fontSize,
						family: "'IBM Plex Sans', sans-serif",
					},
				},
			},
			scales: {
				x: {
					grid: {
						lineWidth: 0,
					},
					ticks: {
						padding: margin,
						color: theme ? colorDark : colorLight,
						font: {
							size: fontSize,
							family: font,
						},
					},
				},
				y: {
					display: false,
				},
			},
		}),
		[theme, width, isMobile, fontSize, margin, colorDark, colorLight]
	)

	return (
		<div className={styles.bar_chart}>
			<Bar data={data} options={options} />
		</div>
	)
})
