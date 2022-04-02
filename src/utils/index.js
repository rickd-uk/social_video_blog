export const getUserAccessToken = () => {
	const accessToken =
		localStorage.getItem('accessToken') !== 'undefined'
			? JSON.parse(localStorage.getItem('accessToken'))
			: localStorage.removeItem('accessToken')

	return accessToken
}

export const getUser = () => {
	const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.removeItem('user')

	return userInfo
}

export const logoutUser = () => {
	localStorage.removeItem('accessToken')
	localStorage.removeItem('user')
}

export const checkToken = () => {
	let checkRevoked = true
	let accessToken = getUserAccessToken()

	// getAuth()
	// 	.verifyIdToken(accessToken, checkRevoked)
	// 	.then((payload) => {
	// 		// Token is valid.
	// 		console.log(`Token is valid: ${payload}`)
	// 	})
	// 	.catch((error) => {
	// 		if (error.code === 'auth/id-token-revoked') {
	// 			console.log(`Token has been revoked`)
	// 		} else {
	// 			console.log(`Token is invalid!!!`)
	// 		}
	// 	})
}
