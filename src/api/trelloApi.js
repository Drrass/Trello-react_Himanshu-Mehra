import axios from 'axios';

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const accessToken = import.meta.env.VITE_TRELLO_ACCESS_TOKEN;

const trelloApi = {
  getBoards: async () => {
    const url = `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${accessToken}`;
    const response = await axios.get(url);
    return response.data;
  },

  createBoard: async (boardName) => {
    const url = `https://api.trello.com/1/boards/?key=${apiKey}&token=${accessToken}`;
    const response = await axios.post(url, { name: boardName });
    return response.data;
  },
  fetchLists: (boardId) =>
    axios.get(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${accessToken}`
    ),
  
  fetchCards: (listId) =>
    axios.get(
      `https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${accessToken}`
    ),
  
  createList: (boardId, name) =>
    axios.post(
      `https://api.trello.com/1/boards/${boardId}/lists`,
      null,
      { params: { name, key: apiKey, token: accessToken } }
    ),
  
  createCard: (listId, name) =>
    axios.post(
      `https://api.trello.com/1/cards`,
      null,
      { params: { idList: listId, name, key: apiKey, token: accessToken } }
    ),
  
  deleteCard: (cardId) =>
    axios.delete(`https://api.trello.com/1/cards/${cardId}`, {
      params: { key: apiKey, token: accessToken },
    }),
  
  deleteList: (listId) =>
    axios.put(`https://api.trello.com/1/lists/${listId}/closed`, null, {
      params: { value: true, key: apiKey, token: accessToken },
    }),
    fetchChecklists: async (cardId) => {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/cards/${cardId}/checklists`,
          { params: { key: apiKey, token: accessToken } }
        );
        return response.data.map((checklist) => ({
          ...checklist,
          items: checklist.checkItems || [],
        }));
      } catch (error) {
        throw new Error("Error fetching checklists");
      }
    },
  
    createChecklist: async (cardId, name) => {
      try {
        const response = await axios.post(
          `https://api.trello.com/1/checklists`,
          null,
          {
            params: { idCard: cardId, name, key: apiKey, token: accessToken },
          }
        );
        return { ...response.data, items: [] };
      } catch (error) {
        throw new Error("Error creating checklist");
      }
    },
  
    addItem: async (checklistId, itemName) => {
      try {
        const response = await axios.post(
          `https://api.trello.com/1/checklists/${checklistId}/checkItems`,
          null,
          {
            params: { name: itemName, key: apiKey, token: accessToken },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Error adding item");
      }
    },
  
    toggleItemState: async (cardId, itemId, state) => {
      try {
        await axios.put(
          `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}`,
          null,
          {
            params: { state, key: apiKey, token: accessToken },
          }
        );
      } catch (error) {
        throw new Error("Error toggling item state");
      }
    },
  
    deleteChecklist: async (checklistId) => {
      try {
        await axios.delete(`https://api.trello.com/1/checklists/${checklistId}`, {
          params: { key: apiKey, token: accessToken },
        });
      } catch (error) {
        throw new Error("Error deleting checklist");
      }
    },
  
    deleteItem: async (checklistId, itemId) => {
      try {
        await axios.delete(
          `https://api.trello.com/1/checklists/${checklistId}/checkItems/${itemId}`,
          {
            params: { key: apiKey, token: accessToken },
          }
        );
      } catch (error) {
        throw new Error("Error deleting item");
      }
    },
};

export default trelloApi;
