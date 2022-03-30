import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Category, Create, Feed, Navbar, Search, VideoPin } from '../Components'
import { Routes, Route } from 'react-router-dom'

import { categories } from '../data'

const Home = ({ user }) => {
	return (
		<>
			<Navbar user={user} />
			<Flex width={'100vw'}>
				<Flex direction={'column'} justifyContent='start' alignItems={'center'} width='8%'>
					{categories && categories.map((data) => <Category key={data.id} data={data} />)}
				</Flex>
				<Flex width={'95%'} px={4}>
					<Routes>
						<Route path='/' element={<Feed />} />
						<Route path='/category/:categoryId' element={<Feed />} />
						<Route path='/create' element={<Create />} />
						<Route path='/videoDetail/:videoId' element={<VideoPin />} />
						<Route path='/search' element={<Search />} />
					</Routes>
				</Flex>
			</Flex>
		</>
	)
}

export default Home
