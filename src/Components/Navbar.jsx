import React from 'react'

import logo from '../img/logo.png'
import logo_dark from '../img/logo_dark.png'
import { Link, useNavigate } from 'react-router-dom'

//prettier-ignore
import { useColorModeValue, Flex, useColorMode, Image, InputGroup, InputLeftElement, Input } from '@chakra-ui/react'
import { IoMoon, IoSearch, IoSunny } from 'react-icons/io5'

const Navbar = ({ user }) => {
	const { colorMode, toggleColorMode } = useColorMode()
	const bg = useColorModeValue('gray.600', 'gray.300')
	return (
		<Flex justifyContent={'space-between'} alignItems='center' width={'100vw'} p={4}>
			<Link to={'/'}>
				<Image src={colorMode === 'light' ? logo_dark : logo} width={'180px'}></Image>
			</Link>

			<InputGroup mx={6} width='50vw'>
				<InputLeftElement pointerEvents='none' children={<IoSearch fontSize={25} />} />
				<Input type='text' placeholder='Search...' fontSize={18} fontWeight='medium' variant={'filled'}></Input>
			</InputGroup>

			<Flex justifyContent={'center'} alignItems={'center'}>
				<Flex
					width='40px'
					height='40px'
					justifyContent={'center'}
					alignItems={'center'}
					cursor={'pointer'}
					borderRadius='5px'
					onClick={toggleColorMode}>
					{colorMode === 'light' ? <IoMoon fontSize={25} /> : <IoSunny fontSize={25} />}
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Navbar
