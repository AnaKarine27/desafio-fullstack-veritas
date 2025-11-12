import React from 'react';

const Header = ({ onOpenModal }) => {
  return (

<header className="app-header">
      <h1 className="header-title" >| Kanban de Tarefas</h1>
      <button
        onClick={onOpenModal}
        className="add-task-button"
      >
        + Adicionar Nova Tarefa
      </button>
    </header>
  );
};

export default Header;