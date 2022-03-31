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
