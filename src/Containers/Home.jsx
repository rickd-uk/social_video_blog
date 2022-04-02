import React, { useEffect, useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { Category, Create, Feed, Navbar, Search, UserProfile, VideoPin, VideoPinDetail } from '../Components'
import { Routes, Route } from 'react-router-dom'

import { categories } from '../data'

const Home = ({ user }) => {
	return (
		<>
			<Navbar user={user} />
			<Flex width={'100vw'}>
				<Flex direction={'column'} justifyContent='start' alignItems={'center'} width='5%' ml={2}>
					{categories && categories.map((data) => <Category key={data.id} data={data} />)}
				</Flex>
				<Flex width={'95%'} px={4} justifyContent={'center'} alignItems={'center'}>
					<Routes>
						<Route path='/' element={<Feed />} />

						<Route path='/category/:categoryId' element={<Feed />} />
						<Route path='/create' element={<Create />} />
						<Route path='/videoDetail/:videoId' element={<VideoPinDetail />} />
						<Route path='/search' element={<Search />} />
						<Route path='/userDetail/:userId' element={<UserProfile />} />
					</Routes>
				</Flex>
			</Flex>
		</>
	)
}

export default Home
