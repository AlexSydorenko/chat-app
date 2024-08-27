import PropTypes from 'prop-types';

import './toast-notification.css';

const ToastNotification = (props) => {
    const { message, type } = props.toastData;

    const backgroundColor = type === 'error' ? '#f44336' : '#4caf50';

    return (
        <div className="toast-notification" style={{ backgroundColor }}>
            <p className="notification-message">
                {message}
            </p>
        </div>
    )
}

ToastNotification.propTypes = {
    toastData: PropTypes.shape({
        message: PropTypes.string,
        type: PropTypes.string,
    }),
}

export default ToastNotification;
