import PropTypes from 'prop-types';
import { useState } from 'react';

import ChatList from '../chat-list/chat-list';
import InfoSearchPanel from '../info-search-panel/info-search-panel';

import './sidebar.css';

const Sidebar = (props) => {
    const [searchUsersValue, setSearchUsersValue] = useState("");

    const changeSearchUsersValue = (value) => {
        setSearchUsersValue(value);
    }
    
    return (
        <div className="sidebar">
            <InfoSearchPanel 
                changeSearchUsersValue={changeSearchUsersValue}
                setSelectedChat={props.setSelectedChat} />
            <ChatList 
                searchUsersValue={searchUsersValue}
                selectedChat={props.selectedChat} 
                setSelectedChat={props.setSelectedChat}
                lastMessageGlobal={props.lastMessageGlobal} />
        </div>
    )
}

Sidebar.propTypes = {
    setSelectedChat: PropTypes.func,
    selectedChat: PropTypes.object,
    lastMessageGlobal: PropTypes.object,
}

export default Sidebar;
