import axios from 'axios';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../app/features/toast/toastSlice';

import { IoSend } from "react-icons/io5";

import './send-message-input.css';

const SendMessageInput = ({ selectedChat, addNewMessage, setLastMessage }) => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const [messageText, setMessageText] = useState("");

    const handleMessageSending = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/messages/send', {
                senderId: user._id,
                receiverId: selectedChat._id,
                message: messageText
            });

            const newMessage = response.data;

            e.target.reset();
            addNewMessage(newMessage);
            setLastMessage(newMessage);
            await handleAutoResponse();

        } catch (err) {
            console.log(err);
        }
    }

    const handleAutoResponse = async () => {
        try {
            const res = await axios.get('/api/messages/auto-response');
            const autoResponseQuote = res.data.quote;

            axios.post('/api/messages/send', {
                senderId: selectedChat._id,
                receiverId: user._id,
                message: autoResponseQuote
            })
                .then(res => res.data)
                .then(autoResponseMessage => {
                    addNewMessage(autoResponseMessage);
                    setLastMessage(autoResponseMessage);
                    dispatch(setToast({
                        message: `New message from ${selectedChat.fullName}: ${autoResponseMessage.message}`,
                        type: 'success'
                    }))
                })
                .catch(err => console.log(err));

        } catch {
            dispatch(setToast({
                message: `Error! Couldn't fetch auto response`,
                type: 'error'
            }))
        }
    }

    return (
        <div className="send-message-panel">
            <form
                onSubmit={(e) => handleMessageSending(e)}
                className="send-message-form">
                <input
                    onChange={(e) => setMessageText(e.target.value)}
                    type="text"
                    placeholder="Type your message..."
                    required />
                <button className="send-message-btn">
                    <IoSend className="send-btn" size={25} color={"#aeaeae"} />
                </button>
            </form>
        </div>
    )
}

SendMessageInput.propTypes = {
    selectedChat: PropTypes.object,
    addNewMessage: PropTypes.func,
    setLastMessage: PropTypes.func,
}

export default SendMessageInput;
