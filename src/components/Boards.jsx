import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, createBoard } from '../redux/slices/boardsSlice';
import { Link } from 'react-router-dom';
import { Typography, CircularProgress, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const Boards = () => {
  const dispatch = useDispatch();
  const { boards, isLoading, error } = useSelector((state) => state.boards);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  // Fetch boards on mount
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    dispatch(createBoard(newBoardName));
    setNewBoardName('');
    setOpenCreateDialog(false);
  };

  const openDialog = () => setOpenCreateDialog(true);
  const closeDialog = () => {
    setOpenCreateDialog(false);
    setNewBoardName('');
  };

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
        Your Boards
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography sx={{ color: 'error.main' }}>{error}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          {/* Add Board Button */}
          <Box
            onClick={openDialog}
            sx={{
              width: 250,
              height: 150,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#e2e8f0',
              borderRadius: 2,
              boxShadow: 3,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <Typography variant="h6" component="h3">
              + Create Board
            </Typography>
          </Box>

          {boards.map((board) => (
            <Box
              key={board.id}
              component={Link}
              to={`/boards/${board.id}`}
              sx={{
                width: 250,
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textDecoration: 'none',
                color: board.prefs?.backgroundImage ? 'white' : 'black',
                backgroundColor: board.prefs?.backgroundColor || '#e2e8f0',
                backgroundImage: board.prefs?.backgroundImage
                  ? `url(${board.prefs.backgroundImage})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }, }} >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  textAlign: 'center',
                  p: 1,
                  backgroundColor: board.prefs?.backgroundImage ? 'rgba(0,0,0,0.6)' : 'transparent',
                  borderRadius: 1,}}>
                {board.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={openCreateDialog} onClose={closeDialog}>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <TextField
            label="Board Name"
            fullWidth
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateBoard} disabled={!newBoardName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Boards;
