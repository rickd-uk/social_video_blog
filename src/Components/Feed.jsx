import { getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { firebaseApp } from '../firebase-config'
import { getAllFeeds } from '../utils/getData'

// ui elements
import Spinner from '../Components/Spinner'
import { Box, SimpleGrid } from '@chakra-ui/react'
import VideoPin from './VideoPin'

const Feed = () => {
	// firebase db instance
	const fireStoreDB = getFirestore(firebaseApp)

	const [feeds, setFeeds] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		getAllFeeds(fireStoreDB).then((data) => {
			setFeeds(data)
			setTimeout(() => {
				setLoading(false)
			}, 3000)
		})
	}, [fireStoreDB])

	if (loading) <Spinner msg={'Loading your feeds'} />

	return (
		<SimpleGrid minChildWidth='300px' spacing='15px' width='full' autoColumns={'max-content'} px='2px' overflow={'hidden'}>
			{feeds && feeds.map((data) => <VideoPin key={data.id} maxWidth={420} height='80px' data={data} />)}
		</SimpleGrid>
	)
}

export default Feed
