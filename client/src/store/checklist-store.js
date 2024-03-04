import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
}

export const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {
    // Set initial state
    setTodo: (state, action) => {
        const items = action.payload;
        state.items = items.map((item) => {
            if (item.checked) {
                return {
                    ...item,
                    checked: true
                }
            } else {
                return {
                    ...item,
                    checked: false
                }
            }
        });
    },
    addTodo: (state, action) => {
        state.items.push(action.payload);
    },
    deleteTodo: (state, action) => {
        state.items.splice(action.payload, 1);
    },
    selectTodo: (state, action) => {
        state.items[action.payload.index].checked = action.payload.isSelected;
    },
    editTodo: (state, action) => {
        state.items[action.payload.index].name = action.payload.updatedName;
    }
  },
})

export const { setTodo, addTodo, deleteTodo, selectTodo, editTodo } = checklistSlice.actions;

export default checklistSlice.reducer;