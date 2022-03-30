// prettier-ignore
import { Flex, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const Create = () => {
	const { colorMode } = useColorMode()
	const bg = useColorModeValue('gray.50', 'gray.900')
	const textColor = useColorModeValue('gray.900', 'gray.50')

	return <Flex justifyContent={'center'} alignItems={'center'} width={'90%'} minHeight='100vh' bg={bg}></Flex>
}

export default Create
