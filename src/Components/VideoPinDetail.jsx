import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { IoHome } from 'react-icons/io5'
import Spinner from './Spinner'

import { getSpecificVideo } from '../utils/getData'

import { firebaseApp } from '../firebase-config'
import { getFirestore } from 'firebase/firestore'
const firestoreDB = getFirestore(firebaseApp)

const VideoPinDetail = () => {
	const { videoId } = useParams()
	const [loading, setLoading] = useState(false)
	const [videoInfo, setVideoInfo] = useState(null)

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
		</Flex>
	)
}

export default VideoPinDetail
