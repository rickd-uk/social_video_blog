import { Flex, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const VideoPin = ({ data }) => {
	const { colorMode } = useColorMode()
	const bg = useColorModeValue('blackAlpha.700', 'gray.900')
	const textColor = useColorModeValue('gray.100', 'gray.100')

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
			<Link to={''}>
				<video src={data.videoUrl} muted onMouseOver={(e) => e.target.play()} onMouseOut={(e) => e.target.pause()} />
			</Link>

			<Flex position={'absolute'} bottom='0' left='0' p={2} bg={bg} width='full' direction={'column'}>
				<Flex width={'full'} justifyContent={'space-between'} alignItems={'center'}>
					<Text color={textColor} isTruncated fontSize={20}>
						{data.title}
					</Text>

					<Image src=''></Image>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default VideoPin
