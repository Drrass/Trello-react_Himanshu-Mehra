import React, { useState, useEffect } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Box,Typography,TextField,Button,Card,
CardContent,Slider,Checkbox,List,ListItem,ListItemText,IconButton,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateChecklist = ({ open, onClose, onChecklistSave, cardChecklists }) => {
  const [checklists, setChecklists] = useState(cardChecklists || []);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [newCheckItem, setNewCheckItem] = useState("");

  useEffect(() => {
    setChecklists(cardChecklists || []);
  }, [cardChecklists]);

  const handleSave = () => {
    onChecklistSave(checklists);
    onClose();
  };
//when user enter name in the checklist and click add it add a new checklist with unique id, initialise the checklist with empty item array clears checklist name
  const addChecklist = () => {
    if (newChecklistName.trim()) {
    setChecklists([ ...checklists,{ id: Date.now(), name: newChecklistName, items: [] },]);
    setNewChecklistName("");
    }
  };

  const deleteChecklist = (index) => {
    const newChecklists = [...checklists];
    newChecklists.splice(index, 1);
    setChecklists(newChecklists);
  };

  const addCheckItem = (index) => {
    if (newCheckItem.trim()) {
      const newChecklists = [...checklists];
      newChecklists[index].items.push({ id: Date.now(), name: newCheckItem, checked: false });
      setChecklists(newChecklists);
      setNewCheckItem("");
    }
  };

  const deleteCheckItem = (checklistIndex, itemIndex) => {
    const newChecklists = [...checklists];
    newChecklists[checklistIndex].items = newChecklists[checklistIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    setChecklists(newChecklists);
  };

  const toggleCheckItem = (checklistIndex, itemIndex) => {
    const newChecklists = [...checklists];
    newChecklists[checklistIndex].items[itemIndex].checked =
      !newChecklists[checklistIndex].items[itemIndex].checked;
    setChecklists(newChecklists);
  };

  const calculateProgress = (items) => {
    const completed = items.filter((item) => item.checked).length;
    return items.length === 0 ? 0 : (completed / items.length) * 100;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Checklist</DialogTitle>
      <DialogContent>
        {/* Add Checklist */}
        <Box>
          <TextField
            fullWidth
            label="Checklist Name"
            variant="outlined"
            value={newChecklistName}
            onChange={(e) => setNewChecklistName(e.target.value)}
            sx={{ mb: 2 }}/>
          <Button
            variant="contained"
            color="primary"
            onClick={addChecklist}
            sx={{ mb: 2 }}>
            Add Checklist
          </Button>
        </Box>

        {/* Display Checklists */}
        {checklists.map((checklist, checklistIndex) => (
          <Card key={checklist.id} sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">{checklist.name}</Typography>
                <IconButton
                  color="error"
                  onClick={() => deleteChecklist(checklistIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Task Progress Slider */}
              <Slider
                value={calculateProgress(checklist.items)}
                max={100}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }} />

              <List>
                {checklist.items.map((item, itemIndex) => (
                  <ListItem
                    key={item.id}
                    dense
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() =>
                          deleteCheckItem(checklistIndex, itemIndex)
                        }>
                        <DeleteIcon />
                      </IconButton>
                    }>
                    <Checkbox
                      checked={item.checked}
                      onChange={() =>
                        toggleCheckItem(checklistIndex, itemIndex)
                      }/>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </List>
              {/* Add Checkitem */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  label="New Check Item"
                  variant="outlined"
                  fullWidth
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => addCheckItem(checklistIndex)}>
                  Add
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateChecklist;
