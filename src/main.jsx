import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ThemeProvider, BaseStyles} from '@primer/react'
import {customTheme} from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider colorMode='dark'>
      <BaseStyles>
      <App />
      </BaseStyles>
    </ThemeProvider>
  </React.StrictMode>,
)
