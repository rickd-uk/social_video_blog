import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme'

import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
	<ChakraProvider>
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		<Router>
			<App />
		</Router>
	</ChakraProvider>,
	document.getElementById('root'),
)
