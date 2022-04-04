// prettier-ignore
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	Grid,
	GridItem,
	Image,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverFooter,
	PopoverHeader,
	PopoverTrigger,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react'
import { FcApproval } from 'react-icons/fc'

import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { IoHome, IoPause, IoPlay, IoTrash } from 'react-icons/io5'
import Spinner from './Spinner'

import { getUser } from '../utils'
import { deleteVideo, getSpecificVideo, getUserInfo, recommendedFeeds } from '../utils/getData'

import logo from '../img/logo.png'
import { MdForward10, MdFullscreen, MdOutlineReplay10, MdVolumeOff, MdVolumeUp } from 'react-icons/md'

import ReactPlayer from 'react-player'

import { firebaseApp } from '../firebase-config'
import { getFirestore } from 'firebase/firestore'
import screenfull from 'screenfull'
import HTMLReactParser from 'html-react-parser'

import moment from 'moment'
import { useNavigate } from 'react-router-dom'

import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import RecommendedVideos from './RecommendedVideos'
import Category from './Category'

const avatar = process.env.REACT_APP_DEFAULT_PROFILE_PIC

const format = (seconds) => {
	if (isNaN(seconds)) {
		return '00:00'
	}
	const date = new Date(seconds * 1000)
	const hh = date.getUTCHours()
	const mm = date.getUTCMinutes().toString().padStart(2, '0')
	const ss = date.getUTCSeconds().toString().padStart(2, '0')

	if (hh) return `${hh}:${mm}:${ss}` // 01:54:23
	return `${mm}:${ss}` // 03:24
}

const downloadVideo = (videoInfo) => {
	const storage = getStorage()
	getDownloadURL(ref(storage, `${videoInfo.videoUrl}`))
		.then(async (url) => {
			const file = await fetch(url)
			const fileBlog = await file.blob()
			const fileURL = URL.createObjectURL(fileBlog)

			const anchor = document.createElement('a')
			anchor.href = fileURL
			anchor.download = 'test.mp4'

			document.body.appendChild(anchor)
			anchor.click()

			document.body.removeChild(anchor)
			URL.revokeObjectURL(fileURL)
		})
		.catch((error) => {
			// Handle any errors
			console.log(error)
		})
}

const VideoPinDetail = () => {
	const { videoId } = useParams()
	const firestoreDB = getFirestore(firebaseApp)

	const navigate = useNavigate()

	const [localUser] = getUser()
	const [loading, setLoading] = useState(false)
	const [videoInfo, setVideoInfo] = useState(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [muted, setMuted] = useState(false)
	const [volume, setVolume] = useState(0.5)
	const [played, setPlayed] = useState(0)
	const [seeking, setSeeking] = useState(false)
	const [userInfo, setUserInfo] = useState(null)
	const [feeds, setFeeds] = useState(null)

	// Custom reference
	const playerRef = useRef()
	const playerContainer = useRef()

	const textColor = useColorModeValue('gray.900', 'gray.50')

	useEffect(() => {
		if (videoId) {
			setLoading(true)
			getSpecificVideo(firestoreDB, videoId).then((data) => {
				setVideoInfo(data)

				recommendedFeeds(firestoreDB, data?.category, videoId).then((feed) => {
					setFeeds(feed)
				})

				getUserInfo(firestoreDB, data.userId).then((user) => {
					setUserInfo(user)
				})

				setLoading(false)
			})
		}
	}, [videoId])

	useEffect(() => {}, [muted, volume, played])

	const handleVolumeChange = (e) => {
		setVolume(parseFloat(e / 100))
		e === 0 ? setMuted(true) : setMuted(false)
	}

	const handle10sFastRewind = () => {
		playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
	}

	const handle10sFastForward = () => {
		playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
	}

	const handleProgress = (changeState) => {
		if (!seeking) {
			setPlayed(parseFloat(changeState.played / 100) * 100)
		}
	}

	const handleSeekChange = (e) => {
		setPlayed(parseFloat(e / 100))
	}

	const onSeekMouseDown = (e) => {
		setSeeking(true)
	}

	const onSeekMouseUp = (e) => {
		setSeeking(false)
		playerRef.current.seekTo(e / 100)
	}

	const deleteTheVideo = (videoId) => {
		setLoading(true)
		deleteVideo(firestoreDB, videoId)
		setLoading(false)
		navigate('/', { replace: true })
	}

	const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00'
	const duration = playerRef.current ? playerRef.current.getDuration() : '00:00'

	const elapsedTime = format(currentTime)
	const totalDuration = format(duration)

	if (loading) return <Spinner />

	return (
		<Flex width={'full'} height={'auto'} justifyContent={'center'} alignItems={'center'} direction={'column'} py={2} px={4}>
			<Flex alignItems={'center'} width={'full'} my={4}>
				<Link to={'/'}>
					<IoHome fontSize={25} />
				</Link>
				<Box width='1px' height={'25px'} bg={'gray.500'} mx={2}></Box>
				<Text width={'100%'} isTruncated color={textColor} fontWeight='semibold'>
					{videoInfo?.title}
				</Text>
			</Flex>

			{/* Main Grid for video  */}
			<Grid templateColumns={'repeat(4,1fr)'} gap={2} width={'100%'}>
				<GridItem width={'100%'} colSpan={'3'}>
					<Flex width={'full'} bg='black' position='relative' ref={playerContainer}>
						{/* PLAYER */}
						<ReactPlayer
							url={videoInfo?.videoUrl}
							width={'100%'}
							height={'100%'}
							playing={isPlaying}
							muted={muted}
							volume={volume}
							ref={playerRef}
							onProgress={handleProgress}
						/>

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

							{/* Progress Controls */}
							<Flex
								width={'full'}
								alignItems='center'
								direction={'column'}
								px={2}
								bgGradient='linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)'>
								{/* Slider */}
								<Slider
									aria-label='slider-ex-4'
									value={played * 100}
									transition={'ease-in-out'}
									transitionDuration={'0.2'}
									onChange={handleSeekChange}
									onMouseDown={onSeekMouseDown}
									onChangeEnd={onSeekMouseUp}
									min={0}
									max={100}>
									<SliderTrack bg='teal.50'>
										<SliderFilledTrack bg='teal.300' />
									</SliderTrack>
									<SliderThumb boxSize={3} bg='teal.300' transition={'ease-in-out'} transitionDuration={'0.2'} />
								</Slider>

								{/* Other player controls - rewind, fast forward */}
								<Flex width={'full'} alignItems={'center'} my={2} gap={4}>
									<MdOutlineReplay10 fontSize={30} color={'#f1f1f1'} cursor={'pointer'} onClick={handle10sFastRewind} />
									<Box onClick={() => setIsPlaying(!isPlaying)}>
										{!isPlaying ? (
											<IoPlay fontSize={30} color='#f2f2f2' cursor={'pointer'} />
										) : (
											<IoPause fontSize={30} color='#f2f2f2' cursor={'pointer'} />
										)}
									</Box>
									<MdForward10 fontSize={30} color={'#f1f1f1'} cursor={'pointer'} onClick={handle10sFastForward} />
									{/* */}
									{/* Volumes controls */}
									<Flex alignItems={'center'} ml={5}>
										<Box
											onClick={() => {
												setMuted(!muted)
											}}>
											{!muted ? (
												<MdVolumeUp fontSize={30} color='#f1f1f1' cursor='pointer' />
											) : (
												<MdVolumeOff fontSize={30} color='#f1f1f1' cursor='pointer' />
											)}
										</Box>

										<Slider
											aria-label='slider-ex-1'
											defaultValue={volume * 100}
											min={0}
											max={100}
											size={'md'}
											width={20}
											mx={2}
											onChangeStart={handleVolumeChange}
											onChangeEnd={handleVolumeChange}>
											<SliderTrack bg='teal.50'>
												<SliderFilledTrack bg='teal.300' />
											</SliderTrack>
											<SliderThumb boxSize={3} bg='teal.300' />
										</Slider>
									</Flex>
									{/* EO Volume Controls */}
									{/* Duration of video */}
									<Flex alignItems={'center'} gap={2}>
										<Text fontSize={16} color='whitesmoke'>
											{elapsedTime}
										</Text>
										<Text fontSize={16} color='whitesmoke'>
											/
										</Text>
										<Text fontSize={16} color='whitesmoke'>
											{totalDuration}
										</Text>
									</Flex>
									{/* Logo*/}
									{/* <Image src={logo} width={'120px'} ml={'auto'} /> */}
									{/* Make Fullscreen */}
									<MdFullscreen
										fontSize={30}
										color='#f1f1f1'
										cursor={'pointer'}
										onClick={() => {
											screenfull.toggle(playerContainer.current)
										}}
									/>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
					{/* Video description */}
					{videoInfo?.description && (
						<Flex my={6} direction={'column'}>
							<Text my={2} fontSize={25} fontWeight={'semibold'}>
								Description
							</Text>
							{HTMLReactParser(videoInfo?.description)}
						</Flex>
					)}
				</GridItem>
				<GridItem width={'100%'} colSpan={'1'}>
					{userInfo && (
						<Flex direction={'column'} width={'full'}>
							<Flex alignItems={'center'} width='full'>
								<Image
									src={userInfo?.photoURL ?? avatar}
									rounded='full'
									width={'60px'}
									height={'60px'}
									minHeight={'60px'}
									minWidth={'60px'}
								/>
								<Flex direction={'column'} ml={3}>
									<Flex alignItems={'center'}>
										<Text isTruncated color={textColor} fontWeight='semibold'>
											{userInfo?.displayName}
										</Text>
										<FcApproval />
									</Flex>
									{videoInfo?.id && (
										<Text fontSize={12} color={textColor} ml={'auto'}>
											{moment(new Date(parseInt(videoInfo.id)).toISOString()).fromNow()}
										</Text>
									)}
								</Flex>
							</Flex>

							{/* Action buttons */}
							<Flex justifyContent={'space-around'} mt={6}>
								{userInfo?.uid === localUser?.uid && (
									<Popover>
										<PopoverTrigger>
											<Button colorScheme={'red'}>
												<IoTrash fontSize={20} color={'#fff'} />
											</Button>
										</PopoverTrigger>
										<PopoverContent>
											<PopoverArrow />
											<PopoverCloseButton />

											<PopoverBody>Are you sure you want to delete it?</PopoverBody>
											<PopoverFooter d='flex' justifyContent={'flex-end'}>
												<ButtonGroup size='sm'>
													<Button colorScheme='red' onClick={() => deleteTheVideo(videoId)}>
														Yes
													</Button>
													<PopoverCloseButton bg='purple.500' />
												</ButtonGroup>
											</PopoverFooter>
										</PopoverContent>
									</Popover>
								)}

								<Button colorScheme={'whatsapp'} rounded='full' my={2} mt={'0'} onClick={() => downloadVideo(videoInfo)}>
									Free Download
								</Button>
							</Flex>
						</Flex>
					)}
				</GridItem>
			</Grid>

			{feeds?.length === 0 ||
				(feeds !== null && (
					<Flex direction={'column'} width='full' my={6}>
						<Text my={4} fontSize={25} fontWeight='semibold'>
							Recommended Videos
						</Text>
						<RecommendedVideos feeds={feeds} />
					</Flex>
				))}
		</Flex>
	)
}

export default VideoPinDetail
