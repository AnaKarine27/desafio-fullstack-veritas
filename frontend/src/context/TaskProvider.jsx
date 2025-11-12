import React, { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { TaskContext } from './TaskContext'; 
import { FIXED_STATUSES } from '../types';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [validStatuses] = useState(FIXED_STATUSES);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {

      setError(`Falha ao carregar tarefas: ${err.message}`); 
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (taskData) => {
    try {
      const defaultStatus = validStatuses.length > 0 ? validStatuses[0] : FIXED_STATUSES[0];
      const newTaskData = { ...taskData, status: taskData.status || defaultStatus }; 
      const newTask = await createTask(newTaskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {

      setError(`Falha ao adicionar tarefa: ${err.message}`); 
      throw err;
    }
  };

  const editTask = async (id, updatedData) => {
    try {
      const updatedTask = await updateTask(id, updatedData);
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (err) {

      setError(`Falha ao atualizar tarefa: ${err.message}`); 
      throw err;
    }
  };

  const moveTask = async (id, newStatus) => {
    const taskToMove = tasks.find(t => t.id === id);
    if (!taskToMove || !validStatuses.includes(newStatus)) return; 
    
    setTasks(prevTasks => prevTasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
    ));

    try {
      await updateTask(id, { ...taskToMove, status: newStatus });
    } catch (err) {
      await loadTasks(); 

      setError(`Falha ao mover tarefa: ${err.message}`); 
      console.error(err);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {

      setError(`Falha ao excluir tarefa: ${err.message}`); 
      throw err;
    }
  };

  const value = {
    tasks,
    loading,
    error,
    VALID_STATUSES: validStatuses,
    addTask,
    editTask,
    moveTask,
    removeTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};