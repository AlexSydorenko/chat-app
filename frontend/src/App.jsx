import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from './app/features/toast/toastSlice';

import Sidebar from './components/sidebar/sidebar';
import ChatWindow from './components/chat-window/chat-window';
import ToastNotification from './components/toast-notification/toast-notification';

import './App.css';

function App() {
  const toast = useSelector(state => state.toast.toast);
  const dispatch = useDispatch();

  const [selectedChat, setSelectedChat] = useState();
  const [lastMessage, setLastMessage] = useState();

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (toast) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        dispatch(clearToast());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  return (
    <div className="container">
      <Sidebar 
        selectedChat={selectedChat}
        setSelectedChat={ (userToChatWith) => setSelectedChat(userToChatWith) }
        lastMessageGlobal={lastMessage} />

      <ChatWindow
        selectedChat={selectedChat}
        setSelectedChat={ (userToChatWith) => setSelectedChat(userToChatWith) }
        setLastMessage={(message) => { setLastMessage(message) }} />
      
      {
          (showToast && toast) ? (
              <ToastNotification
                  toastData={toast} />
          ) : null
      }
    </div>
  )
}

export default App;
