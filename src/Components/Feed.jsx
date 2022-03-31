import Spinner from '../Components/Spinner'
import { getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { firebaseApp } from '../firebase-config'
import { getAllFeeds } from '../utils/getData'

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

	return <Spinner msg={'Loading your feeds'} />

	// return <div>Feed</div>
}

export default Feed
