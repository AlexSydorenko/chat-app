import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import Message from '../message/message';

import './chat-messages.css';

const ChatMessages = ({ chatMessages, selectedChat }) => {
    const user = useSelector(state => state.user.user);
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    }, [chatMessages]);
    
    return (
        <div className="chat-messages-wrapper">
            {
                chatMessages
                    .map(message => (
                        selectedChat._id === message.senderId || selectedChat._id === message.receiverId ? (
                            <div className={message.senderId === user._id ? "my-message-ref-wrapper" : "message-ref-wrapper"} 
                                key={message._id} 
                                ref={lastMessageRef}>
                                    <Message 
                                        selectedChat={selectedChat}
                                        message={message} />
                            </div>
                        ) : null
                    ))
            }
        </div>
    )
}

ChatMessages.propTypes = {
    chatMessages: PropTypes.array,
    selectedChat: PropTypes.object,
}

export default ChatMessages;
