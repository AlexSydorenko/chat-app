import axios from 'axios';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import './add-chat-modal.css';

const AddChatModal = ({ addChatModalVisibility, changeAddChatModalVisibility, addNewSidebarUser }) => {
    const user = useSelector(state => state.user.user);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleAddChat = (e) => {
        e.preventDefault();

        axios.post(`/api/auth/login-user-to-chat/${user._id}`, { fullName: `${firstName} ${lastName}` })
            .then(res => res.data)
            .then(newUser => {
                addNewSidebarUser({
                    userInfo: newUser,
                    lastMessage: null
                });
                changeAddChatModalVisibility();
            });
    }

    return (
        addChatModalVisibility ? (
            <div className="add-chat-modal">
                <h1 className="add-chat-modal-title">
                    Enter user full name
                </h1>

                <form 
                    onSubmit={(e) => handleAddChat(e)}
                    className="add-chat-form">
                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        placeholder="First name"
                        required />
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        placeholder="Last name"
                        required />
                    <button className="create-chat-btn">
                        Create new chat
                    </button>
                </form>
            </div>
        ) : null
    )
}

AddChatModal.propTypes = {
    addChatModalVisibility: PropTypes.bool,
    changeAddChatModalVisibility: PropTypes.func,
    addNewSidebarUser: PropTypes.func,
}

export default AddChatModal;
