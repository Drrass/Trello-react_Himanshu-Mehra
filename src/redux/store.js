import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slices/boardsSlice';

const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
});

export default store;
