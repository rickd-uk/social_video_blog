import { firebaseApp } from '../firebase-config'
// prettier-ignore
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

// fetch all docs from firebase
export const getAllFeeds = async (firestoreDB) => {
	const feeds = await getDocs(query(collection(firestoreDB, 'Videos'), orderBy('id', 'desc')))

	return feeds.docs.map((doc) => doc.data())
}
