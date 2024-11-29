import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {Box, Typography,Button,CircularProgress,Paper,Card,CardContent,TextField, IconButton,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateChecklist from "./CreateChecklist";

const BoardDetails = () => {
const { boardId } = useParams();
const navigate = useNavigate();
 const [lists, setLists] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState(null);
const [activeInputList, setActiveInputList] = useState(null);
const [newCardName, setNewCardName] = useState("");
 const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
const [selectedCard, setSelectedCard] = useState(null);
 const [cardChecklists, setCardChecklists] = useState({});
 const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
 const accessToken = import.meta.env.VITE_TRELLO_ACCESS_TOKEN;


 // here i am fetching all list in the selected Board using trello api  The lists state is populated with list data, each containing an array of cards.
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${accessToken}`
        );

        const listsWithCards = await Promise.all(
          response.data.map(async (list) => {
            const cards = await axios.get(
              `https://api.trello.com/1/lists/${list.id}/cards?key=${apiKey}&token=${accessToken}`
            );
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


// when Create New List Button is Clicked then user should prommpt to enter listname
  const createList = async () => {
    const listName = prompt("Enter the name for the new list:");
    if (!listName) return;

    try {
      const response = await axios.post(
        `https://api.trello.com/1/boards/${boardId}/lists`,
        null,
        {
          params: {
            name: listName,
            key: apiKey,
            token: accessToken,
          },
        }
      );

      setLists([...lists, { ...response.data, cards: [] }]);
    } catch (err) {
      setError("Error creating list");
    }
  };

  //when i click on the add card buttom for a specific list a text input appear for specific list a tet input appear to enter card name
  const createCard = async (listId) => {
    if (!newCardName.trim()) return;
    try {
      const response = await axios.post(
        `https://api.trello.com/1/cards`,
        null,
        {
          params: {
            name: newCardName,
            idList: listId,
            key: apiKey,
            token: accessToken,
          },
        }
      );
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, response.data] }
            : list
        )
      );
      setActiveInputList(null);
      setNewCardName("");
    } catch (err) {
      setError("Error creating card");
    }
  };

  // when i clicked on delete icon delete request is made to remove the card 
  const deleteCard = async (cardId, listId) => {
    try {
      await axios.delete(`https://api.trello.com/1/cards/${cardId}`, {
        params: {
          key: apiKey,
          token: accessToken,
        },
      });

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
      await axios.put(`https://api.trello.com/1/lists/${listId}/closed`, null, {
        params: {
          value: true, // This sets the 'closed' property of the list to true
          key: apiKey,
          token: accessToken,
        },
      });

  
      // Remove the list from the state after closing it
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    } catch (err) {
      setError("Error deleting list");
    }
  };

  // when i click on cards createchecklistModal is open the card id passed to createChecklist to manage its state
  const openChecklistModal = (cardId) => {
    setSelectedCard(cardId);
    setIsChecklistModalOpen(true);
  };

  //it update the checklist for currently updated card,checklists parameter contains the updated checklist data
  const handleChecklistSave = (checklists) => {
    setCardChecklists((prevChecklists) => ({
      ...prevChecklists,
      [selectedCard]: checklists,
    }));
    console.log(cardChecklists);
  };

  return (
    <Box sx={{ p: 4 }}>
      
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/boards")} sx={{ mr: 2 }}>
          Back to Boards
        </Button>  
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={createList}
        sx={{ mb: 4 }}>
        Create New List
      </Button>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
        sx={{
         display: "flex",
         alignItems:"flex-start",
        overflowX: "auto",
        gap: 3,
        p: 2,
          }}>
          {lists.map((list) => (
            <Paper
              key={list.id}
              elevation={3}
              sx={{
                width: 300,
                minHeight: 200,
                p: 3,
                bgcolor: "grey.100",
              }} >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Typography variant="h6">{list.name}</Typography>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => deleteList(list.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ mt: 2 }}>
                {list.cards.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {list.cards.map((card) => (
                      <Card
                        key={card.id}
                        variant="outlined"
                        sx={{
                          position: "relative",
                          width: 250,
                          height: 30,
                          mb: 2,
                          p: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                        onClick={() => openChecklistModal(card.id)}
                      >
                        <CardContent>{card.name}</CardContent>
                        <IconButton
                          color="error"
                          size="small"
                          sx={{
                            position: "absolute",
                            right: 4,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCard(card.id, list.id);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No cards yet.
                  </Typography>
                )}
              </Box>

              {activeInputList === list.id ? (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Enter card name"
                    variant="outlined"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => createCard(list.id)}
                  >
                    Add Card
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setActiveInputList(list.id);
                    setNewCardName("");
                  }}
                >
                  Add Card
                </Button>
              )}
            </Paper>
          ))}
        </Box>
      )}

      <CreateChecklist
      //  open is basicaly a bolean value to determine modal is open or not
      // onChecklistSave= on clicking save parent component get final updated list of checklists
      // cardChecklists an array containing existing checklists associated with a card
        open={isChecklistModalOpen}   
        onClose={() => setIsChecklistModalOpen(false)}
        onChecklistSave={handleChecklistSave}
        cardChecklists={cardChecklists[selectedCard] || []
        
        }
      />
    </Box>
  );
};
export default BoardDetails;
