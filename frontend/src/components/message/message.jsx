import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { formatDateTime } from '../../utils/dataParser';

import './message.css';

const Message = ({ message, selectedChat }) => {
    const user = useSelector(state => state.user.user);

    return (
        message.senderId === user._id ? (
            <div className="my-message-wrapper">
                <div className="my-message-data">
                    <div className="my-message-text">
                        <p>{message.message}</p>
                    </div>
                    <span className="message-time">
                        {formatDateTime(message.createdAt)}
                    </span>
                </div>
            </div>
        ) : (
            <div className="message-wrapper">
                <img className="message-user-avatar" src={selectedChat.profilePic} alt={selectedChat.fullName} />
                <div className="message-data">
                    <div className="message-text">
                        <p>{message.message}</p>
                    </div>
                    <span className="message-time">
                        {formatDateTime(message.createdAt)}
                    </span>
                </div>
            </div>
        )
    )
}

Message.propTypes = {
    message: PropTypes.object,
    selectedChat: PropTypes.object,
}

export default Message;
