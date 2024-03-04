import { configureStore } from '@reduxjs/toolkit'
import checklistReducer from './checklist-store';
import userReducer from './user-store';

export const store = configureStore({
  reducer: {
    checklist: checklistReducer,
    user: userReducer,
  },
})