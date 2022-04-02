// prettier-ignore
import { collection, getDocs, orderBy, query, doc, getDoc, deleteDoc } from 'firebase/firestore'

// fetch all docs from firebase
export const getAllFeeds = async (firestoreDB) => {
	const feeds = await getDocs(query(collection(firestoreDB, 'Videos'), orderBy('id', 'desc')))

	return feeds.docs.map((doc) => doc.data())
}

//  fetch user info: user & uid
export const getUserInfo = async (fireStoreDB, userId) => {
	const userRef = doc(fireStoreDB, 'users', userId)

	const userSnap = await getDoc(userRef)
	if (userSnap.exists()) {
		return userSnap.data()
	} else {
		return 'No such document exists'
	}
}

// get specific video
export const getSpecificVideo = async (fireStoreDB, videoId) => {
	const videoRef = doc(fireStoreDB, 'Videos', videoId)

	const videoSnap = await getDoc(videoRef)
	if (videoSnap.exists()) {
		return videoSnap.data()
	} else {
		return 'No such document exists'
	}
}

export const deleteVideo = async (fireStoreDB, videoId) => {
	await deleteDoc(doc(fireStoreDB, 'Videos', videoId))
}
