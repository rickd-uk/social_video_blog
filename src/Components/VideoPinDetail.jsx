import { Box, Flex, Grid, GridItem, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { IoHome, IoPause, IoPlay } from 'react-icons/io5'
import Spinner from './Spinner'

import { getSpecificVideo } from '../utils/getData'

import { MdForward10, MdFullscreen, MdOutlineReplay10, MdVolumeOff, MdVolumeUp } from 'react-icons/md'

import ReactPlayer from 'react-player'

import { firebaseApp } from '../firebase-config'
import { getFirestore } from 'firebase/firestore'

const firestoreDB = getFirestore(firebaseApp)

const VideoPinDetail = () => {
	const { videoId } = useParams()
	const [loading, setLoading] = useState(false)
	const [videoInfo, setVideoInfo] = useState(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [muted, setMuted] = useState(false)
	const textColor = useColorModeValue('gray.900', 'gray.50')

	useEffect(() => {
		if (videoId) {
			setLoading(true)
			getSpecificVideo(firestoreDB, videoId).then((data) => {
				setVideoInfo(data)
				setLoading(false)
			})
		}
	}, [videoId])

	if (loading) return <Spinner />

	return (
		<Flex width={'full'} height={'auto'} justifyContent={'center'} alignItems={'center'} direction={'column'} py={2} px={4}>
			<Flex alignItems={'center'} width={'full'} my={4}>
				<Link to={'/'}>
					<IoHome fontSize={25} />
				</Link>
				<Box width='2px' height={'20px'} bg={'gray.500'} mx={2}></Box>
				<Text width={'30%'} isTruncated color={textColor} fontWeight='semibold'>
					{videoInfo?.title}
					{console.log(videoInfo?.title?.length)}
				</Text>
			</Flex>

			{/* Main Grid for video  */}
			<Grid templateColumns={'repeat(3,1fr)'} gap={2} width={'100%'}>
				<GridItem width={'100%'} colSpan={'2'}>
					<Flex width={'full'} bg='black' position='relative'>
						{console.log(videoInfo)}
						<ReactPlayer url={videoInfo?.videoUrl} width={'100%'} height={'100%'} playing={isPlaying} muted={muted} />

						{/* Control for video player */}
						<Flex
							position={'absolute'}
							top={0}
							left={0}
							right={0}
							bottom={0}
							direction='column'
							justifyContent={'space-between'}
							alignItems='center'
							zIndex={1}
							cursor='pointer'>
							{/* play icon */}
							<Flex
								alignItems={'center'}
								justifyContent={'center'}
								onClick={() => {
									setIsPlaying(!isPlaying)
								}}
								width='full'
								height='full'>
								{!isPlaying && <IoPlay fontSize={60} color='#f2f2f2' cursor={'pointer'} />}
							</Flex>
						</Flex>
					</Flex>
				</GridItem>
				<GridItem width={'100%'} colSpan={'1'}></GridItem>
			</Grid>
		</Flex>
	)
}

export default VideoPinDetail
