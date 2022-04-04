import { useEffect, useState } from 'react'

import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'
import { getAllFeeds, getCategoryFeeds } from '../utils/getData'

// ui elements
import Spinner from '../Components/Spinner'
import { Box, SimpleGrid } from '@chakra-ui/react'
import VideoPin from './VideoPin'
import { useParams } from 'react-router-dom'

const Feed = () => {
	// firebase db instance
	const fireStoreDB = getFirestore(firebaseApp)

	const [feeds, setFeeds] = useState(null)
	const [loading, setLoading] = useState(false)
	const { categoryId } = useParams()

	useEffect(() => {
		setLoading(true)
		if (categoryId) {
			getCategoryFeeds(fireStoreDB, categoryId).then((data) => {
				setFeeds(data)
			})
		} else {
			getAllFeeds(fireStoreDB).then((data) => {
				setFeeds(data)
			})
		}
		setLoading(false)
	}, [categoryId, fireStoreDB])

	if (loading) <Spinner msg={'Loading your feeds'} />

	return (
		<SimpleGrid minChildWidth='300px' spacing='15px' width='full' autoColumns={'max-content'} px='2px' overflow={'hidden'}>
			{feeds && feeds.map((data) => <VideoPin key={data.id} maxWidth={420} height='80px' data={data} />)}
		</SimpleGrid>
	)
}

export default Feed
