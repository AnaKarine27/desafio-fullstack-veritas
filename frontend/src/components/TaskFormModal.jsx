import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../hooks/useTasks';

const getInitialFormData = (taskToEdit, validStatuses) => ({
  task: taskToEdit?.task || '',
  description: taskToEdit?.description || '',
  status: taskToEdit?.status || validStatuses[0],
});

const TaskFormModal = ({ taskToEdit, onClose }) => {
  const { addTask, editTask, VALID_STATUSES } = useTaskContext();
  const isEditing = !!taskToEdit;

  const [formData, setFormData] = useState(
    getInitialFormData(taskToEdit, VALID_STATUSES)
  );
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(getInitialFormData(taskToEdit, VALID_STATUSES));
  }, [isEditing, taskToEdit, VALID_STATUSES]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.task.trim()) {
      setFormError("O título da tarefa é obrigatório.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await editTask(taskToEdit.id, formData);
      } else {
        await addTask(formData);
      }
      onClose();
    } catch (err) {
      setFormError(`Falha na operação: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {isEditing ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}
        </h2>

        <form onSubmit={handleSubmit} className="task-form">

          <div className="form-group">
            <label htmlFor="task" className="form-label">Título*</label>
            <input
              id="task"
              name="task"
              value={formData.task}
              onChange={handleChange}
              className="form-input"
              placeholder="Título da tarefa (obrigatório)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Descrição (Opcional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="form-input text-area"
              placeholder="Descrição detalhada"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              {VALID_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {formError && <p className="form-error">{formError}</p>}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="button button-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`button button-submit ${isSubmitting ? 'button-loading' : ''}`}
            >
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Tarefa')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;