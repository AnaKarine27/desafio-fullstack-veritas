import React, { useState, useMemo, useCallback } from 'react';
import { useTaskContext } from '../hooks/useTasks';
import KanbanColumn from '../components/KanbanColumn';
import TaskFormModal from '../components/TaskFormModal';
import Header from '../components/Header';

const KanbanBoard = () => {
  const { tasks = [], loading, error, VALID_STATUSES } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleOpenModal = useCallback(() => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }, []);

  const tasksByStatus = useMemo(() => {
    return VALID_STATUSES.reduce((acc, status) => {
      acc[status] = tasks.filter(task => task.status === status);
      return acc;
    }, {});
  }, [tasks, VALID_STATUSES]);

  if (loading) return (
    <div className="status-message loading-message">
      A carregar tarefas... (Verificando API)
    </div>
  );

  if (error) return (
    <div className="status-message error-message">
      <h2 className="error-title">Erro de conexão com o servidor</h2>
      <p>{error}</p>
      <p className="error-tip">Por favor, verifique se o serviço de backend está ativo.</p>
    </div>
  );

  return (
    <div className="kanban-app-container">
      <Header onOpenModal={handleOpenModal} />

      <main className="kanban-main-content">
        <div className="kanban-board-container">
          {VALID_STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </main>

      {isModalOpen && (
        <TaskFormModal
          taskToEdit={taskToEdit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default KanbanBoard;