import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext'; 

export const useTaskContext = () => {
  const context = useContext(TaskContext);
    
  return context;
};