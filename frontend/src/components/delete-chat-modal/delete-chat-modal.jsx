import axios from 'axios';

import PropTypes from 'prop-types';

import './delete-chat-modal.css';

const DeleteChatModal = (props) => {
    const { deleteChatModalVisibility, changeDeleteChatModalVisibility, 
            selectedChat, setSelectedChat, changeSidebarUsers } = props;

    const handleDeleteChat = () => {
        const conversationId = selectedChat.conversationId;

        axios.delete(`/api/conversations/delete/${conversationId}`)
            .then(() => {
                // console.log(selectedChat.conversationId);
                changeSidebarUsers(conversationId);
                setSelectedChat(null);
            });
    }

    return (
        deleteChatModalVisibility ? (
            <div className="delete-chat-modal">
                <h1 className="delete-chat-modal-title">
                    Delete this chat?
                </h1>

                <div className="delete-chat-btns">
                    <button 
                        onClick={ () => handleDeleteChat() }
                        className="delete-chat-confirm">
                            Yes
                    </button>
                    <button 
                        onClick={() => changeDeleteChatModalVisibility()}
                        className="delete-chat-reject">
                            No
                    </button>
                </div>
            </div>
        ) : null
    )
}

DeleteChatModal.propTypes = {
    deleteChatModalVisibility: PropTypes.bool,
    changeDeleteChatModalVisibility: PropTypes.func,
    selectedChat: PropTypes.object,
    setSelectedChat: PropTypes.func,
    changeSidebarUsers: PropTypes.func,
}

export default DeleteChatModal;
