import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme'

ReactDOM.render(
	<ChakraProvider>
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		<App />
	</ChakraProvider>,
	document.getElementById('root'),
)
