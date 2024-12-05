import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const accessToken = import.meta.env.VITE_TRELLO_ACCESS_TOKEN;

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (listId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${accessToken}`
      );
      return { listId, cards: response.data };
    } catch (err) {
      return rejectWithValue('Error fetching cards');
    }
  }
);

export const createCard = createAsyncThunk(
  'cards/createCard',
  async ({ listId, name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/cards?key=${apiKey}&token=${accessToken}`,
        {
          name,
          idList: listId,
        }
      );
      return { listId, card: response.data };
    } catch (err) {
      return rejectWithValue('Error creating card');
    }
  }
);

export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async (cardId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${accessToken}`
      );
      return cardId;
    } catch (err) {
      return rejectWithValue('Error deleting card');
    }
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState: {
    cardsByListId: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cardsByListId[action.payload.listId] = action.payload.cards;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        const { listId, card } = action.payload;
        if (state.cardsByListId[listId]) {
          state.cardsByListId[listId].push(card);
        } else {
          state.cardsByListId[listId] = [card];
        }
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        const cardId = action.payload;
        Object.keys(state.cardsByListId).forEach((listId) => {
          state.cardsByListId[listId] = state.cardsByListId[listId].filter(
            (card) => card.id !== cardId
          );
        });
      });
  },
});

export default cardsSlice.reducer;
