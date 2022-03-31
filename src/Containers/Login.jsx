import { Flex, Image, Button, HStack } from '@chakra-ui/react'
import React from 'react'

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { firebaseApp } from '../firebase-config'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

import { useNavigate } from 'react-router-dom'

import MusicBg from '../img/musicbg.jpg'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
	const firebaseAuth = getAuth(firebaseApp)
	const provider = new GoogleAuthProvider()
	const firestoreDB = getFirestore(firebaseApp)

	const navigate = useNavigate()

	const login = async () => {
		const { user } = await signInWithPopup(firebaseAuth, provider)
		const { refreshToken, providerData } = user

		localStorage.setItem('user', JSON.stringify(providerData))
		localStorage.setItem('accessToken', JSON.stringify(refreshToken))

		await setDoc(doc(firestoreDB, 'users', providerData[0].uid), providerData[0])

		navigate('/', { replace: true })
	}

	return (
		<Flex justifyContent={'center'} alignItems={'center'} width={'100vw'} height={'100vh'} position={'relative'}>
			<Image src={MusicBg} objectFit='cover' width={'full'} height={'full'} />
			<Flex
				position={'absolute'}
				width={'100vw'}
				height={'100vh'}
				bg={'blackAlpha.600'}
				top={0}
				left={0}
				justifyContent='center'
				alignItems={'center'}>
				<HStack>
					<Button leftIcon={<FcGoogle fontSize={25} />} colorScheme='whiteAlpha' shadow={'lg'} onClick={() => login()}>
						Sign in with Google
					</Button>
				</HStack>
			</Flex>
		</Flex>
	)
}

export default Login
