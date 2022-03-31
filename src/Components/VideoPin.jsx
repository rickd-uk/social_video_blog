import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const VideoPin = ({ data }) => {
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
				{console.log(data.videoUrl)}
				<video src={data.videoUrl} muted onMouseOver={(e) => e.target.play()} onMouseOut={(e) => e.target.pause()} />
			</Link>
		</Flex>
	)
}

export default VideoPin
