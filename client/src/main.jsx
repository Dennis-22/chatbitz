import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './css/index.css'
import AppProvider from './appContext'
import ChatProvider from './chatContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AppProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AppProvider>
)
