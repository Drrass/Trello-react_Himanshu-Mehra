import React, { useState, useEffect } from "react";
import {Modal,Box,Typography,Button, TextField,Checkbox,Alert, Slider,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateChecklist = ({ cardId, onClose }) => {
  const [checklists, setChecklists] = useState([]);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [newItems, setNewItems] = useState({});
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
  const accessToken = import.meta.env.VITE_TRELLO_ACCESS_TOKEN;

  const fetchChecklists = async () => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/cards/${cardId}/checklists?key=${apiKey}&token=${accessToken}`
      );
      const data = await response.json();
      // Ensure checklists have an items array
      const formattedData = data.map((checklist) => ({
        ...checklist,
        items: checklist.checkItems || [],
      }));
      setChecklists(formattedData);
    } catch (err) {
      console.error("Error fetching checklists:", err);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [cardId]);

  const handleCreateChecklist = async () => {
    if (!newChecklistName.trim()) return;
    try {
      const response = await fetch(
        `https://api.trello.com/1/checklists?idCard=${cardId}&name=${newChecklistName}&key=${apiKey}&token=${accessToken}`,
        { method: "POST" }
      );
      const data = await response.json();
      // Add the new checklist with an empty items array
      setChecklists([...checklists, { ...data, items: [] }]);
      console.log(checklists);
      setNewChecklistName("");
    } catch (err) {
      console.error("Error creating checklist:", err);
      setError("Failed to create checklist.");
    }
  };

  const handleAddItem = async (checklistId) => {
    const itemName = newItems[checklistId]?.trim();
    if (!itemName) return;
    try {
      const response = await fetch(
        `https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${itemName}&key=${apiKey}&token=${accessToken}`,
        { method: "POST" }
      );
      const data = await response.json();
      // Update the checklist with the new item
      setChecklists((prev) =>
        prev.map((checklist) =>
          checklist.id === checklistId
            ? { ...checklist, items: [...checklist.items, data] }
            : checklist
        )
      );
      setNewItems((prev) => ({ ...prev, [checklistId]: "" }));
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const toggleItemState = async (checklistId, itemId, isChecked) => {
    const state = isChecked ? "incomplete" : "complete";
    try {
      await fetch(
        `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${state}&key=${apiKey}&token=${accessToken}`,
        { method: "PUT" }
      );
      setChecklists((prev) =>
        prev.map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: checklist.items.map((item) =>
                  item.id === itemId ? { ...item, state } : item
                ),
              }
            : checklist
        )
      );
    } catch (err) {
      console.error("Error toggling item state:", err);
    }
  };

  const deleteChecklist = async (checklistId) => {
    try {
      await fetch(
        `https://api.trello.com/1/checklists/${checklistId}?key=${apiKey}&token=${accessToken}`,
        { method: "DELETE" }
      );
      // Remove the checklist from the state
      setChecklists((prev) =>
        prev.filter((checklist) => checklist.id !== checklistId)
      );
    } catch (err) {
      console.error("Error deleting checklist:", err);
      setError("Failed to delete checklist.");
    }
  };

  const deleteItem = async (checklistId, itemId) => {
    try {
      await fetch(
        `https://api.trello.com/1/checklists/${checklistId}/checkItems/${itemId}?key=${apiKey}&token=${accessToken}`,
        { method: "DELETE" }
      );
      // Remove the item from the checklist
      setChecklists((prev) =>
        prev.map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: checklist.items.filter((item) => item.id !== itemId),
              }
            : checklist
        )
      );
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const calculateCompletion = (checklist) => {
    const total = checklist.items?.length || 0; // Ensure items exists
    const completed =
      checklist.items?.filter((item) => item.state === "complete").length || 0;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <Modal open={true} onClose={onClose}>
    <Box  sx={{  position: 'absolute',  top: '50%',  left: '50%',  transform: 'translate(-50%, -50%)',  padding: 2,
        width: 600,  backgroundColor: "white",  borderRadius: 2,  maxHeight: "80vh",  overflowY: "auto",   }}  >

      <Typography variant="h6">Manage Checklists</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      <TextField  label="New Checklist Name"  value={newChecklistName}
        onChange={(e) => setNewChecklistName(e.target.value)}  />
      <Button onClick={handleCreateChecklist}>Create Checklist</Button>

      {checklists.map((checklist) => (
        <Box  key={checklist.id}  sx={{ marginBottom: 2,  padding: 2,  backgroundColor: "#f5f5f5",  borderRadius: 1,  }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>{checklist.name}</Typography>
            <Button  onClick={() => deleteChecklist(checklist.id)}  sx={{ marginLeft: 1 }}  >
              <DeleteIcon />
            </Button>
          </Box>
          <Slider value={calculateCompletion(checklist)} disabled />
          {checklist.items?.map((item) => (
            <Box key={item.id} sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={item.state === "complete"}
                onChange={() =>
                  toggleItemState(
                    checklist.id,
                    item.id,
                    item.state === "complete"
                  )
                }
              />
              <Typography>{item.name}</Typography>
              <Button
                onClick={() => deleteItem(checklist.id, item.id)}
                sx={{ marginLeft: 1 }}
              >
                <DeleteIcon />
              </Button>
            </Box>
          ))}
          <TextField
            label="Add Item"
            value={newItems[checklist.id] || ""}
            onChange={(e) =>
              setNewItems({ ...newItems, [checklist.id]: e.target.value })
            }
          />
          <Button onClick={() => handleAddItem(checklist.id)}>
            Add Item
          </Button>
        </Box>
      ))}
  
      <Button onClick={onClose}>Close</Button>
    </Box>
  </Modal>
  
  );
};

export default CreateChecklist;
