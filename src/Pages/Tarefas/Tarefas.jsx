import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Tarefas
        </Typography>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <TextField
            label="Nova tarefa"
            variant="outlined"
            fullWidth
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddTask} sx={{backgroundColor: '#eab71b'}}>
            Adicionar
          </Button>
        </div>
        <List>
          {tasks.map((task, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteTask(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTask(index)}
              />
              <ListItemText
                primary={task.text}
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.6 : 1,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default TodoList;
