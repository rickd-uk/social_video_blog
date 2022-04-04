import { Spinner, Flex, Image } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserInfo, userUploadedVideos } from '../utils/getData'
import RecommendedVideos from './RecommendedVideos'

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const UserProfile = () => {
	const { userId } = useParams()
	const [isLoading, setIsLoading] = useState(false)
	const [userInfo, setUserInfo] = useState(null)
	const [feeds, setFeeds] = useState(null)

	const firestoreDB = getFirestore(firebaseApp)

	useEffect(() => {
		setIsLoading(true)
		if (userId) {
			getUserInfo(firestoreDB, userId).then((user) => {
				setUserInfo(user)
			})

			userUploadedVideos(firestoreDB, userId).then((feed) => {
				setFeeds(feed)
			})
			setIsLoading(false)
		}
	}, [firestoreDB, userId])

	if (isLoading) <Spinner />
	return (
		<Flex alignItems={'center'} justifyContent={'center'} width={'full'} height={'auto'} p={2} direction={'column'}>
			<Flex alignItems={'center'} justifyContent={'center'} width={'full'} height={'auto'} p={2} direction={'column'}>
				<Image src={randomImage} height={'320px'} width={'full'} objectFit={'cover'} borderRadius={'md'}></Image>
				<Image
					src={userInfo?.photoURL}
					width='120px'
					objectFit={'cover'}
					border='2px'
					borderColor={'gray.100'}
					rounded='full'
					shadow={'lg'}
					mt='-16'></Image>
			</Flex>

			{feeds?.length === 0 ||
				(feeds !== null && (
					<Flex direction={'column'} width='full' my={6}>
						<RecommendedVideos feeds={feeds} />
					</Flex>
				))}
		</Flex>
	)
}

export default UserProfile
