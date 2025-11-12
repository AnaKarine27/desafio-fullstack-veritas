import React from 'react';
import { TaskProvider } from './context/TaskProvider'; 
import KanbanBoard from './pages/KanbanBoard';
import './styles/App.css';

function App() {
  return (
    <TaskProvider>
      <KanbanBoard />
    </TaskProvider>
  );
}

export default App;