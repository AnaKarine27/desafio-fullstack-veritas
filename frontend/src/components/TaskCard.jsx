import React, { useState } from 'react';
import { useTaskContext } from '../hooks/useTasks';
import { getNextStatus } from '../utils/utils';

const TaskCard = ({ task, onEdit }) => {
  const { VALID_STATUSES, moveTask, removeTask } = useTaskContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const nextStatus = getNextStatus(task.status, VALID_STATUSES);

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir a tarefa: "${task.task}"?`)) {
      setIsDeleting(true);
      try {
        await removeTask(task.id);
      } catch (e) {
        alert(e.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleMove = () => {
    if (nextStatus) {
      moveTask(task.id, nextStatus);
    }
  };

  const statusClass = {
    "A Fazer": 'status-to-do',
    "Em Progresso": 'status-in-progress',
    "Concluídas": 'status-done',
  }[task.status] || 'status-default';

  return (
    <div className={`task-card ${statusClass}`}>
      <h4 className="task-title">{task.task}</h4>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-actions">
        {nextStatus && (
          <button
            onClick={handleMove}
            className="action-button move-button"
            title={`Mover para ${nextStatus}`}
          >
            Mover »
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          className="action-button"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="action-button delete-button"
        >
          {isDeleting ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;