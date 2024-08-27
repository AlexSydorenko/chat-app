import PropTypes from 'prop-types';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../app/features/toast/toastSlice';
import { formatDate } from '../../utils/dataParser';

import DeleteChatModal from '../delete-chat-modal/delete-chat-modal';

import { RiDeleteBin6Line } from "react-icons/ri";
import './sidebar-user.css';

const SidebarUser = (props) => {
    const { userInfo, lastMessage } = props.userData;

    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const [deleteChatModalVisibility, setDeleteChatModalVisibility] = useState(false);

    const handleChatSelection = () => {
        if (user) {
            return props.setSelectedChat(userInfo);
        }

        dispatch(setToast({
            message: 'Error! Log in using Google accout first.',
            type: 'error'
        }));
    }

    const checkChatSelection = () => {
        if (props.selectedChat) {
            return props.selectedChat._id === userInfo._id;
        }
        return false;
    }

    const getUserFullname = () => {
        if (props.selectedChat) {
            return props.selectedChat._id === userInfo._id ? 
                    props.selectedChat.fullName :
                    userInfo.fullName;
        }
        return userInfo.fullName;
    }

    return (
        <>
            <div
                onClick={() => handleChatSelection()}
                className={`sidebar-user ${checkChatSelection() ? 'sidebar-user-selected' : ''}`}>
                <div className="sidebar-user-info">
                    <img src={userInfo.profilePic} alt={userInfo.fullName} />
                    <div className="sidebar-user-data">
                        <p className="sidebar-user-fullname">
                            {getUserFullname()}
                        </p>
                        <span className="sidebar-user-last-message">
                            {
                                (user && lastMessage) ? 
                                    (lastMessage.message.length > 40 ? 
                                        `${lastMessage.message.substring(0, 40)}...` : lastMessage.message) : null
                            }
                        </span>
                    </div>
                </div>
                <p className="sidebar-user-last-message-date">
                    {(user && lastMessage) ? formatDate(lastMessage.createdAt) : null}
                </p>

                {
                    !userInfo.predefined ? (
                        <div 
                            onClick={ () => setDeleteChatModalVisibility(!deleteChatModalVisibility) }
                            className="delete-chat-btn">
                            <RiDeleteBin6Line size={20} color="#ca5a5c" />
                        </div>
                    ) : null
                }

                <DeleteChatModal 
                    deleteChatModalVisibility={deleteChatModalVisibility} 
                    changeDeleteChatModalVisibility={ () => setDeleteChatModalVisibility(!deleteChatModalVisibility) }
                    selectedChat={props.selectedChat}
                    setSelectedChat={props.setSelectedChat}
                    changeSidebarUsers={props.changeSidebarUsers} />

            </div>

            <hr className="chat-user-separator" />
        </>
    )
}

SidebarUser.propTypes = {
    userData: PropTypes.shape({
        userInfo: PropTypes.object,
        lastMessage: PropTypes.object
    }),
    setSelectedChat: PropTypes.func,
    selectedChat: PropTypes.object,
    changeSidebarUsers: PropTypes.func,
};

export default SidebarUser;
