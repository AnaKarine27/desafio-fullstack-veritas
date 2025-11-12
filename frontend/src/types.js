const TASK_STATUSES = {
  TODO: 'A Fazer',
  IN_PROGRESS: 'Em Progresso',
  DONE: 'Concluídas'
};

export const FIXED_STATUSES = Object.values(TASK_STATUSES);

/**
 * @typedef {Object} Task
 * @property {string} id 
 * @property {string} task 
 * @property {string} [description] 
 * @property {string} status 
 */