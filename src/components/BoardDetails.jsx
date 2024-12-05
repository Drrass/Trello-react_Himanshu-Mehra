import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLists, createList, deleteList } from '../redux/slices/listsSlice';
import { fetchCards, createCard, deleteCard } from '../redux/slices/cardsSlice';
import { Typography, Box, Button, CircularProgress, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const BoardDetails = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listsByBoardId, isLoading, error } = useSelector((state) => state.lists);
  const { cardsByListId } = useSelector((state) => state.cards);

  const lists = listsByBoardId[boardId] || [];
  const [newListName, setNewListName] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [activeListId, setActiveListId] = useState(null);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLists(boardId));
  }, [dispatch, boardId]);

  useEffect(() => {
    lists.forEach((list) => {
      dispatch(fetchCards(list.id));
    });
  }, [dispatch, lists]);

  const handleCreateList = () => {
    if (newListName.trim()) {
      dispatch(createList({ boardId, name: newListName }));
      setNewListName('');
      setIsListDialogOpen(false);
    }
  };

  const handleCreateCard = () => {
    if (newCardName.trim() && activeListId) {
      dispatch(createCard({ listId: activeListId, name: newCardName }));
      setNewCardName('');
      setActiveListId(null);
      setIsCardDialogOpen(false);
    }
  };

  const handleDeleteList = (listId) => {
    dispatch(deleteList(listId));
  };

  const handleDeleteCard = (cardId) => {
    dispatch(deleteCard(cardId));
  };

  return (
    <Box p={4}>
      <Button variant="outlined" color="primary" onClick={() => navigate('/boards')} sx={{ mb: 2 }}>Back to Boards</Button>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <Button variant="contained" color="primary" onClick={() => setIsListDialogOpen(true)} sx={{ mb: 2 }}>Create New List</Button>
          <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, padding: 1 }}>
            {lists.map((list) => (
              <Card key={list.id} sx={{ backgroundColor: '#f0f0f0', minWidth: 200, padding: 2, position: 'relative', flex: '0 0 auto' }}>
                <Button onClick={() => handleDeleteList(list.id)} size="small" sx={{ position: 'absolute', top: 5, right: 5, minWidth: 'auto', padding: '2px 5px', color: '#ff4d4f', backgroundColor: 'transparent', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffe6e6' } }}>X</Button>
                <CardContent>
                  <Typography variant="h6">{list.name}</Typography>
                  <Box>
                    {cardsByListId[list.id] ? (
                      cardsByListId[list.id].map((card) => (
                        <Box key={card.id} sx={{ backgroundColor: '#e0e0e0', marginTop: 1, padding: 1, borderRadius: 1, position: 'relative' }}>
                          <Button onClick={() => handleDeleteCard(card.id)} size="small" sx={{ position: 'absolute', top: 5, right: 5, minWidth: 'auto', padding: '2px 5px', color: '#ff4d4f', backgroundColor: 'transparent', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffe6e6' } }}>X</Button>
                          <Typography>{card.name}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography color="textSecondary">Loading cards...</Typography>
                    )}
                  </Box>
                  <Button variant="outlined" color="secondary" onClick={() => { setActiveListId(list.id); setIsCardDialogOpen(true); }} sx={{ mt: 2 }}>Create Card</Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      <Dialog open={isListDialogOpen} onClose={() => setIsListDialogOpen(false)}>
        <DialogTitle>Create New List</DialogTitle>
        <DialogContent>
          <TextField label="List Name" value={newListName} onChange={(e) => setNewListName(e.target.value)} fullWidth autoFocus />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsListDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateList} variant="contained" color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCardDialogOpen} onClose={() => setIsCardDialogOpen(false)}>
        <DialogTitle>Create New Card</DialogTitle>
        <DialogContent>
          <TextField label="Card Name" value={newCardName} onChange={(e) => setNewCardName(e.target.value)} fullWidth autoFocus />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCardDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCard} variant="contained" color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BoardDetails;
