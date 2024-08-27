import axios from 'axios';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../app/features/toast/toastSlice';

import SidebarUser from '../sidebar-user/sidebar-user';
import AddChatModal from '../add-chat-modal/add-chat-modal';

import { FaPlus } from "react-icons/fa";
import './chat-list.css';

const ChatList = (props) => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const [sidebarUsers, setSidebarUsers] = useState([]);
    const [predefinedUsers, setPredefinedUsers] = useState([]);
    const [addChatModalVisibility, setAddChatModalVisibility] = useState(false);

    useEffect(() => {
        if (!user) {
            axios.get('/api/users/predefined')
                .then(res => res.data)
                .then(users => {
                    setPredefinedUsers(users);
                });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            axios.get(`/api/users/${user._id}`)
                .then(res => res.data)
                .then(users => {
                    const updatedPredefinedUsers = predefinedUsers.map(predefinedUser => {
                        const matchingUser = users.find(u => u.userInfo._id === predefinedUser.userInfo._id);
                        return matchingUser ? matchingUser : predefinedUser;
                    });

                    setSidebarUsers([
                        ...updatedPredefinedUsers,
                        ...users.filter(user => !predefinedUsers.some(p => p.userInfo._id === user.userInfo._id))
                    ]);
                });
        } else {
            setSidebarUsers(predefinedUsers);
        }
    }, [user, predefinedUsers]);

    const getLastMessage = (userToChatWith) => {
        if (props.lastMessageGlobal) {
            return props.lastMessageGlobal.senderId === userToChatWith.userInfo._id || 
                    props.lastMessageGlobal.receiverId === userToChatWith.userInfo._id ? 
                        props.lastMessageGlobal : 
                        userToChatWith.lastMessage
        }
    }

    const handleAddChatModalVisibility = () => {
        if (!user) {
            return dispatch(setToast({
                message: `Error! Log in using Google accout first.`,
                type: 'error'
            }))
        }
        setAddChatModalVisibility(!addChatModalVisibility);
    }

    const addNewSidebarUser = (newUser) => {
        setSidebarUsers([
            ...sidebarUsers,
            newUser
        ]);
        props.setSelectedChat(newUser.userInfo);
    }

    const changeSidebarUsers = (conversationId) => {
        setSidebarUsers(prevUsers =>
            prevUsers.filter(user => {
                if (user.predefined) {
                    return true;
                }
                return user.userInfo.conversationId !== conversationId;
            })
        );
    };
    

    return (
        <div className="chat-list-wrapper">
            <div className="chat-list-header">
                <h1 className="chat-list-title">
                    Chats
                </h1>
                <div 
                    onClick={() => handleAddChatModalVisibility()}
                    className="add-new-chat-btn">
                    <FaPlus size={20} color={"#6cb6e7"} />
                </div>
                <AddChatModal
                    addChatModalVisibility={addChatModalVisibility}
                    changeAddChatModalVisibility={ () => setAddChatModalVisibility(!addChatModalVisibility) }
                    addNewSidebarUser={ addNewSidebarUser } />
            </div>
            <div className="chat-list">
                {
                    sidebarUsers
                        .filter(user => user.userInfo.fullName.toLowerCase().includes(props.searchUsersValue.toLowerCase()))
                        .sort((a, b) => {
                            const dateA = getLastMessage(a) ? new Date(getLastMessage(a).createdAt) : new Date(0);
                            const dateB = getLastMessage(b) ? new Date(getLastMessage(b).createdAt) : new Date(0);
                            return dateB - dateA;
                        })
                        .map(userData => {
                            return <SidebarUser
                                key={userData.userInfo._id}
                                userData={{
                                    userInfo: userData.userInfo,
                                    lastMessage: getLastMessage(userData) || userData.lastMessage
                                }}
                                selectedChat={props.selectedChat}
                                setSelectedChat={props.setSelectedChat}
                                changeSidebarUsers={changeSidebarUsers} />
                        })
                }
            </div>
        </div>
    )
}

ChatList.propTypes = {
    searchUsersValue: PropTypes.string,
    setSelectedChat: PropTypes.func,
    selectedChat: PropTypes.object,
    lastMessageGlobal: PropTypes.object,
};

export default ChatList;
