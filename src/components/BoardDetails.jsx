import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import trelloApi from "../api/trelloApi"; 
import CreateChecklist from "./CreateChecklist";
import { Box, Typography, Button, CircularProgress, Paper, Card, CardContent, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BoardDetails = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeInputList, setActiveInputList] = useState(null);
  const [newCardName, setNewCardName] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const response = await trelloApi.fetchLists(boardId);

        const listsWithCards = await Promise.all(
          response.data.map(async (list) => {
            const cards = await trelloApi.fetchCards(list.id);
            return { ...list, cards: cards.data };
          })
        );

        setLists(listsWithCards);
      } catch (err) {
        setError("Error fetching lists and cards");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [boardId]);

  const createList = async () => {
    const listName = prompt("Enter the name for the new list:");
    if (!listName || listName.trim() === "") return; 
    try {
      setIsLoading(true);
      const response = await trelloApi.createList(boardId, listName);
      setLists((prevLists) => [...prevLists, { ...response.data, cards: [] }]);
      setError(null);
    } catch (err) {
      setError("Error creating list. Please check the list name or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const createCard = async (listId) => {
    if (!newCardName.trim()) return;
    try {
      const response = await trelloApi.createCard(listId, newCardName);
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId ? { ...list, cards: [...list.cards, response.data] } : list
        )
      );
      setActiveInputList(null);
      setNewCardName("");
    } catch (err) {
      setError("Error creating card");
    }
  };

  const deleteCard = async (cardId, listId) => {
    try {
      await trelloApi.deleteCard(cardId);
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
            : list
        )
      );
    } catch (err) {
      setError("Error deleting card");
    }
  };

  const deleteList = async (listId) => {
    try {
      await trelloApi.deleteList(listId);
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    } catch (err) {
      setError("Error deleting list");
    }
  };

  const openChecklistModal = (cardId) => {
    setSelectedCardId(cardId);
    setShowChecklistModal(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/boards")} sx={{ mr: 2 }}>Back to Boards</Button>
      </Box>

      <Button variant="contained" color="primary" onClick={createList} sx={{ mb: 4 }}>Create New List</Button>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ display: "flex", alignItems: "flex-start", overflowX: "auto", gap: 3, p: 2 }}>
          {lists.map((list) => (
            <Paper key={list.id} elevation={3} sx={{ width: 300, minHeight: 200, p: 3, bgcolor: "grey.100" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">{list.name}</Typography>
                <IconButton color="error" size="small" onClick={() => deleteList(list.id)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ mt: 2 }}>
                {list.cards.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {list.cards.map((card) => (
                      <Card key={card.id} variant="outlined" sx={{ position: "relative", width: 250, height: 80, mb: 2, p: 1,  }} onClick={() => openChecklistModal(card.id)}>
                        <CardContent sx={{ color: "black" }}>{card.name}</CardContent> {/* Set text color to black */}
                        <IconButton color="error" size="small" sx={{ position: "absolute", right: 4, top:2 }} onClick={(e) => { e.stopPropagation(); deleteCard(card.id, list.id); }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No cards yet.</Typography>
                )}
              </Box>

              {activeInputList === list.id ? (
                <Box sx={{ mt: 2 }}>
                  <TextField fullWidth label="Enter card name" variant="outlined" value={newCardName} onChange={(e) => setNewCardName(e.target.value)} />
                  <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => createCard(list.id)}>Add Card</Button>
                </Box>
              ) : (
                <Button variant="outlined" onClick={() => setActiveInputList(list.id)} sx={{ mt: 2 }}>Add Card</Button>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {showChecklistModal && <CreateChecklist cardId={selectedCardId} onClose={() => setShowChecklistModal(false)} />}
    </Box>
  );
};

export default BoardDetails;
