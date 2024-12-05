import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slices/boardsSlice';
import listsReducer from './slices/listsSlice';
import cardsReducer from './slices/cardsSlice';

const store = configureStore({
  reducer: {
    boards: boardsReducer,
    lists: listsReducer, // Add listsReducer here
    cards: cardsReducer,
  },
});

export default store;