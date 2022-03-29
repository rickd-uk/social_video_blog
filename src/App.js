import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Containers/Home'
import Login from './Containers/Login'

import { getUserAccessToken, getUser } from './utils/fetchUser'

const App = () => {
	const [user, setUser] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		const accessToken = getUserAccessToken()
		if (!accessToken) {
			navigate('/login', { replace: true })
		} else {
			const [userInfo] = getUser()
			setUser(userInfo)
		}
	}, [navigate])

	return (
		<Routes>
			<Route path='login' element={<Login />} />
			{user && <Route path='/*' element={<Home user={user} />} />}
		</Routes>
	)
}

export default App
