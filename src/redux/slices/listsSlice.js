// listsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const accessToken = import.meta.env.VITE_TRELLO_ACCESS_TOKEN;

export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${accessToken}`
      );
      console.log("fetched data");
      console.log(response.data);

      
      return { boardId, lists: response.data };
    } catch (err) {
      return rejectWithValue('Error fetching lists');
    }
  }
);

export const createList = createAsyncThunk(
  'lists/createList',
  async ({ boardId, name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/lists?name=${name}&idBoard=${boardId}&key=${apiKey}&token=${accessToken}`
      );
     // console.log(response.data)
      return { boardId, list: response.data };
    } catch (err) {
      return rejectWithValue('Error creating list');
    }
  }
);

export const deleteList = createAsyncThunk('lists/deleteList', async (listId) => {
    try {
      // Make the PUT request to close the list
      const response = await axios.put(
        `https://api.trello.com/1/lists/${listId}/closed`,
        null,
        {
          params: {
            value: true,
            key: apiKey,
            token: accessToken,
          },
        }
      );
      return listId; 
    } catch (error) {
      throw new Error('Error deleting list');
    }
  });

const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    listsByBoardId: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch lists
      .addCase(fetchLists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listsByBoardId[action.payload.boardId] = action.payload.lists;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create a list
      .addCase(createList.fulfilled, (state, action) => {
        const { boardId, list } = action.payload;
        if (state.listsByBoardId[boardId]) {
          state.listsByBoardId[boardId].push(list);
        }
      })
      
      // Delete a list
      .addCase(deleteList.fulfilled, (state, action) => {
        const listId = action.payload;
        Object.keys(state.listsByBoardId).forEach((boardId) => {
          state.listsByBoardId[boardId] = state.listsByBoardId[boardId].filter(
            (list) => list.id !== listId
          );
        });
      });
  },
});

export default listsSlice.reducer;
