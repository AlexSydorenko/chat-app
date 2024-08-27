import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import toastSlice from './features/toast/toastSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    toast: toastSlice,
  },
});
