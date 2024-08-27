import axios from 'axios';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ChatUserInfo from '../chat-user-info/chat-user-info';
import ChatMessages from '../chat-messages/chat-messages';
import SendMessageInput from '../send-message-input/send-message-input';

import { LuMessagesSquare } from "react-icons/lu";
import './chat-window.css';

const ChatWindow = ({ selectedChat, setSelectedChat, setLastMessage }) => {
    const user = useSelector(state => state.user.user);

    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        if (selectedChat) {
            axios.get(`/api/messages?senderId=${user._id}&receiverId=${selectedChat._id}`)
                .then(res => res.data)
                .then(messages => {
                    setChatMessages(messages);
                })
                .catch(err => console.log(err));
        }

    }, [selectedChat, user]);

    const addNewMessage = (message) => {        
        setChatMessages((prevMessages) => [
            ...prevMessages,
            message
        ]);
    }

    return (
        selectedChat ? (
            <div className="chat-window">
                <ChatUserInfo
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat} />
                <ChatMessages
                    selectedChat={selectedChat}
                    chatMessages={chatMessages} />
                <SendMessageInput 
                    selectedChat={selectedChat}
                    addNewMessage={addNewMessage}
                    setLastMessage={setLastMessage} />
            </div>
        ) : (
            <div className="no-chat-selected-window">
                <div className="no-chat-selected-message">
                    <h1>Please select chat to <br/>start a conversation</h1>
                    <LuMessagesSquare size={150} color="#666" />
                </div>
            </div>
        )
    )
}

ChatWindow.propTypes = {
    selectedChat: PropTypes.object,
    setLastMessage: PropTypes.func,
    setSelectedChat: PropTypes.func,
}

export default ChatWindow;
