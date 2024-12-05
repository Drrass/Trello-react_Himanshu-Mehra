import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const accessToken = import.meta.env.VITE_TRELLO_ACCESS_TOKEN;

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${accessToken}`
    );
    return response.data;
  } catch (err) {
    return rejectWithValue('Error fetching boards');
  }
});

export const createBoard = createAsyncThunk(
  'boards/createBoard',  async (boardName, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/boards/?key=${apiKey}&token=${accessToken}`,
        { name: boardName }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue('Error creating board');
    }
  }
);



const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    boards: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.unshift(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default boardsSlice.reducer;
