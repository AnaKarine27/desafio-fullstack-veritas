package main

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"github.com/google/uuid"
)

var ValidStatuses = map[string]bool{
	"A Fazer":      true,
	"Em Progresso": true,
	"Concluídas":   true,
}

type Task struct {
	Id          string `json:"id"`
	Task        string `json:"task"`
	Description string `json:"description,omitempty"`
	Status      string `json:"status"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type TaskRepository interface {
	GetAll() ([]Task, error)
	Create(task Task) (Task, error)
	Update(id string, task Task) (Task, error)
	Delete(id string) error
	GetById(id string) (Task, error)
}

type InMemoryTaskRepository struct {
	tasks    map[string]Task
	taskLock sync.Mutex
	filePath string
}

func NewInMemoryTaskRepository(filePath string) *InMemoryTaskRepository {
	repo := &InMemoryTaskRepository{
		tasks:    make(map[string]Task),
		filePath: filePath,
	}
	if err := repo.loadFromFile(); err != nil {
		fmt.Printf("Aviso: Não foi possível carregar o arquivo de dados: %v\n", err)
		fmt.Println("Iniciando com um repositório vazio.")
	}
	return repo
}

func (r *InMemoryTaskRepository) loadFromFile() error {
	r.taskLock.Lock()
	defer r.taskLock.Unlock()

	data, err := os.ReadFile(r.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Printf("Arquivo de persistência (%s) não encontrado. Iniciando com mapa vazio.\n", r.filePath)
			r.tasks = make(map[string]Task)
			return nil
		}
		return fmt.Errorf("erro ao ler o arquivo: %w", err)
	}

	if len(data) == 0 {
		r.tasks = make(map[string]Task)
		return nil
	}

	err = json.Unmarshal(data, &r.tasks)
	if err != nil {
		fmt.Printf("Erro ao decodificar tasks.json (arquivo pode estar corrompido), iniciando com mapa vazio: %v\n", err)
		r.tasks = make(map[string]Task)
		return err
	}

	fmt.Printf("Carregadas %d tarefas do arquivo %s\n", len(r.tasks), r.filePath)
	return nil
}

func (r *InMemoryTaskRepository) saveToFile() error {
	data, err := json.MarshalIndent(r.tasks, "", "  ")
	if err != nil {
		return fmt.Errorf("erro ao codificar tarefas para JSON: %w", err)
	}

	err = os.WriteFile(r.filePath, data, 0644)
	if err != nil {
		return fmt.Errorf("erro ao salvar arquivo: %w", err)
	}
	return nil
}

func generateRandomId() string {
	return uuid.New().String()
}

func (r *InMemoryTaskRepository) GetAll() ([]Task, error) {
	r.taskLock.Lock()
	defer r.taskLock.Unlock()

	allTasks := make([]Task, 0, len(r.tasks))
	for _, task := range r.tasks {
		allTasks = append(allTasks, task)
	}
	return allTasks, nil
}

func (r *InMemoryTaskRepository) GetById(id string) (Task, error) {
	r.taskLock.Lock()
	defer r.taskLock.Unlock()

	task, exists := r.tasks[id]
	if !exists {
		return Task{}, fmt.Errorf("tarefa não encontrada")
	}
	return task, nil
}

func (r *InMemoryTaskRepository) Create(task Task) (Task, error) {
	r.taskLock.Lock()
	defer r.taskLock.Unlock()

	task.Id = generateRandomId()
	r.tasks[task.Id] = task

	if err := r.saveToFile(); err != nil {
		fmt.Printf("ERRO DE PERSISTÊNCIA (Create): %v\n", err)
	}

	return task, nil
}

func (r *InMemoryTaskRepository) Update(id string, updatedTask Task) (Task, error) {
	r.taskLock.Lock()
	defer r.taskLock.Unlock()

	task, exists := r.tasks[id]
	if !exists {
		return Task{}, fmt.Errorf("tarefa não encontrada")
	}

	task.Task = updatedTask.Task
	task.Description = updatedTask.Description
	task.Status = updatedTask.Status

	r.tasks[id] = task

	if err := r.saveToFile(); err != nil {
		fmt.Printf("ERRO DE PERSISTÊNCIA (Update): %v\n", err)
	}

	return task, nil
}

func (r *InMemoryTaskRepository) Delete(id string) error {
	r.taskLock.Lock()
	defer r.taskLock.Unlock()

	if _, exists := r.tasks[id]; !exists {
		return fmt.Errorf("tarefa não encontrada")
	}

	delete(r.tasks, id)

	if err := r.saveToFile(); err != nil {
		fmt.Printf("ERRO DE PERSISTÊNCIA (Delete): %v\n", err)
	}

	return nil
}
