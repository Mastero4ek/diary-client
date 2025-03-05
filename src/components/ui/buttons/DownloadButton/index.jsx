import { useToBlob } from '@hugocxl/react-to-image'
import { Image } from 'image-js'
import moment from 'moment'
import React from 'react'

import { Icon } from '@/components/ui/general/Icon'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { SmallDesc } from '@/components/ui/descriptions/SmallDesc'
import { Loader } from '@/components/ui/general/Loader'

import styles from './styles.module.scss'

export const DownloadButton = React.memo(({ selector, name }) => {
	const [{ isError, isLoading, isSuccess }, convert, ref] = useToBlob({
		quality: 100,
		selector: selector,
		onSuccess: async data => {
			try {
				const resizedImageUrl = await resizeImage(data)
				const link = document.createElement('a')

				link.download = `${name}_${moment().format('DD_MM_YYYY')}.png`
				link.href = resizedImageUrl
				link.click()
			} catch (error) {
				console.error('Error during image download:', error)
			}
		},
	})

	const resizeImage = async data => {
		try {
			const buffer = await data.arrayBuffer()
			const image = await Image.load(buffer)
			const resizedImage = image.resize({ width: 1024 })
			const blob = await resizedImage.toBlob()

			return URL.createObjectURL(blob)
		} catch (error) {
			console.error('Error resizing image:', error)

			throw error
		}
	}

	return (
		<>
			{isLoading && <Loader logo={false} />}

			<div className={styles.download_button_wrapper}>
				<div className={styles.download_button_desc}>
					{isError && (
						<SmallDesc>
							<span>Error saving image! Please try again later.</span>
						</SmallDesc>
					)}

					{isSuccess && (
						<SmallDesc>
							<b>Saving the image was successful!</b>
						</SmallDesc>
					)}
				</div>

				<button
					disabled={isLoading}
					onClick={convert}
					type='button'
					className={styles.download_button}
				>
					<RootDesc>
						<span>Download</span>
					</RootDesc>

					<Icon id='download' />
				</button>
			</div>
		</>
	)
})
