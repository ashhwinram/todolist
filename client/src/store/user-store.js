import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    activeUser: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveuser: (state, action) => {
        state.activeUser.userId = action.payload.id;
        state.activeUser.userName = action.payload.username;
    },
  },
})

export const { setActiveuser } = userSlice.actions;

export default userSlice.reducer;