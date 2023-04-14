import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './css/index.css'
import AppProvider from './appContext'
import ChatProvider from './context/chat/ChatContext'
import UserProvider from './context/user/UserContext'


ReactDOM.createRoot(document.getElementById('root')).render(
    <AppProvider>
      <UserProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </UserProvider>
    </AppProvider>
)
