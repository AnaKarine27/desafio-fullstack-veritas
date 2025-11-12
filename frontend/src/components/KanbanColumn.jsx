import React from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ status, tasks, onEditTask }) => {
  return (
    <div className="kanban-column">

      <h3 className="column-header">
        {status} ({tasks.length})
      </h3>

      <div className="column-content-scroll">
        {tasks.length === 0 ? (
          <p className="no-tasks-message">
            Não há tarefas.
          </p>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))
        )}
      </div>

    </div>
  );
};

export default KanbanColumn;