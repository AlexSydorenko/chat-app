import axios from 'axios';

import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToast } from '../../app/features/toast/toastSlice';

import { MdEdit } from "react-icons/md";
import { BiSolidSave } from "react-icons/bi";
import './chat-user-info.css';

const ChatUserInfo = (props) => {
    const { selectedChat, setSelectedChat } = props;

    const dispatch = useDispatch();

    const [userFullname, setUserFullname] = useState("");
    const [editFullname, setEditFullname] = useState(false);

    const fullnameInputRef = useRef();

    useEffect(() => {
        if (selectedChat) {
            setUserFullname(selectedChat.fullName);
        }
    }, [selectedChat]);

    const handleUserFullnameUpdate = () => {
        if (!editFullname) {
            setEditFullname(true);
            setTimeout(() => {
                fullnameInputRef.current.focus();
                fullnameInputRef.current.setSelectionRange(userFullname.length, userFullname.length);
            }, 0);
        } else {
            setEditFullname(false);
            setUserFullname(selectedChat.fullName);
            axios.put(`/api/users/update/${selectedChat._id}`, { fullName: userFullname })
                .then(res => res.data)
                .then(updatedUser => {
                    dispatch(setToast({
                        message: `Username has been changes successfully: ${selectedChat.fullName} => ${updatedUser.fullName}`,
                        type: 'success'
                    }));
                    setSelectedChat(updatedUser);
                })
                .catch(() => {
                    dispatch(setToast({
                        message: `Error! Couldn't update user fullname.`,
                        type: 'error'
                    }));
                });
        }
    };

    return (
        <div className="chat-user-info-wrapper">
            <div className="chat-user-info">
                <img src={selectedChat.profilePic} alt={selectedChat.fullName} />
                <input
                    ref={fullnameInputRef}
                    onChange={(e) => setUserFullname(e.target.value)}
                    className="chat-user-fullname"
                    value={userFullname}
                    readOnly={!editFullname} />
            </div>
            <span
                onClick={() => handleUserFullnameUpdate()}
                className="chat-user-edit">
                {
                    editFullname ?
                        <BiSolidSave size={30} color={"#333"} /> :
                        <MdEdit size={25} color={"#333"} />
                }
            </span>
        </div>
    )
}

ChatUserInfo.propTypes = {
    selectedChat: PropTypes.object,
    setSelectedChat: PropTypes.func,
}

export default ChatUserInfo;
