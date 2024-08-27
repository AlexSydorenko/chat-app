import axios from 'axios';

import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser } from '../../app/features/user/userSlice';
import { setToast } from '../../app/features/toast/toastSlice';

import { VscAccount } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";

import './info-search-panel.css';

const InfoSearchPanel = (props) => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch(setUser(user));
        }
    }, [dispatch]);

    const loginUser = async (userData) => {
        axios.post('/api/auth/login', {
            fullName: userData.name,
            email: userData.email,
            predefined: false
        })
            .then(res => res.data)
            .then(user => {
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(setUser(user));
            })
            .catch(err => console.log(err));
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${response.access_token}`
                        }
                    }
                );
                
                await loginUser(res.data);

            } catch (error) {
                console.error('Login failed: ', error);
            }
        },
        // Show error toast notification here
        onFailure: () => {
            dispatch(setToast({
                message: `Error! Couldn't log in using google account`,
                type: 'error'
            }))
        }
    });

    const logOut = () => {
        localStorage.removeItem('user');
        dispatch(clearUser());
        props.setSelectedChat(null);
    }

    return (
        <div className="info-search-panel">
            <div className="auth-user-info">
                <div className="auth-user-data">
                    {
                        user ? (
                            <img className="logged-user-avatar" src={user.profilePic} alt={user.fullName} />
                        ) :
                        <VscAccount size={40} />
                    }
                    <h1 className="auth-user-fullname">
                        {user ? user.fullName : null}
                    </h1>
                </div>

                {
                    !user ? (
                        <button 
                            onClick={ () => googleLogin() }
                            className="log-in-btn">
                                <FaGoogle />
                                <span>Google Log In</span>
                        </button>
                    ) : (
                        <button 
                            onClick={ () => logOut() }
                            className="log-out-btn">
                                <span>Log Out</span>
                        </button>
                    )
                }
            </div>

            <div className="search-chat">
                <CiSearch size={20} />
                <form className="search-chat-form">
                    <input
                        onChange={(e) => props.changeSearchUsersValue(e.target.value)}
                        type="text"
                        placeholder="Search chat"
                        required />
                </form>
            </div>
        </div>
    )
}

InfoSearchPanel.propTypes = {
    changeSearchUsersValue: PropTypes.func,
    setSelectedChat: PropTypes.func,
};

export default InfoSearchPanel;
