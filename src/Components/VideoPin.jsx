import { Flex } from '@chakra-ui/react'
import React from 'react'

const VideoPin = () => {
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
			bg={'gray.200'}></Flex>
	)
}

export default VideoPin
