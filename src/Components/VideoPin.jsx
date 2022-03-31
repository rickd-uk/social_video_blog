import { Flex, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'

import { getUserInfo } from '../utils/getData'

import moment from 'moment'

const avatar =
	'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgetdrawings.com%2Ffree-icon%2Fcool-avatar-icons-56.png&f=1&nofb=1'

const VideoPin = ({ data }) => {
	const fireStoreDB = getFirestore(firebaseApp)

	const { colorMode } = useColorMode()
	const bg = useColorModeValue('blackAlpha.700', 'gray.900')
	const textColor = useColorModeValue('gray.100', 'gray.100')

	const [userID, setUserID] = useState(null)
	const [userInfo, setUserInfo] = useState(null)

	useEffect(() => {
		if (data) setUserID(data.userId)
		if (userID)
			getUserInfo(fireStoreDB, userID).then((data) => {
				setUserInfo(data)
			})
	}, [userID])

	return (
		<Flex
			justifyContent={'space-between'}
			alignItems={'center'}
			cursor={'pointer'}
			shadow={'lg'}
			_hover={{ shadow: 'x1' }}
			rounded='md'
			overflow={'hidden'}
			position='relative'
			maxWidth={'300px'}
			bg={'gray.200'}>
			{/* VIDEO */}
			<Link to={`/videoDetail/${data?.id}`}>
				<video src={data.videoUrl} muted onMouseOver={(e) => e.target.play()} onMouseOut={(e) => e.target.pause()} />
			</Link>

			<Flex position={'absolute'} bottom='0' left='0' p={2} bg={bg} width='full' direction={'column'}>
				{/* Video Title */}
				<Flex width={'full'} justifyContent={'space-between'} alignItems={'center'}>
					<Text color={textColor} isTruncated fontSize={20}>
						{data.title}
					</Text>

					{/* user avatar */}
					<Flex zIndex={100}>
						<Link to={`/userDetail/${userID}`}>
							<Image
								src={userInfo?.photoURL ?? avatar}
								rounded='full'
								minWidth={'50px'}
								width={'50px'}
								height={'50px'}
								border='2px'
								borderColor={bg}
								mt={-10}
							/>
						</Link>
					</Flex>
				</Flex>

				<Text fontSize={12} color={textColor} ml={'auto'}>
					{moment(new Date(parseInt(data.id)).toISOString()).fromNow()}
				</Text>
			</Flex>
		</Flex> // Video
	)
}

export default VideoPin
