package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

func sendJSONError(res http.ResponseWriter, msg string, code int) {
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(code)
	json.NewEncoder(res).Encode(ErrorResponse{Error: msg})
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		res.Header().Set("Access-Control-Allow-Origin", "*")
		res.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		res.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if req.Method == "OPTIONS" {
			res.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(res, req)
	})
}

type TaskHandlers struct {
	Repo TaskRepository
}

func getValidStatus() string {
	keys := make([]string, 0, len(ValidStatuses))
	for k := range ValidStatuses {
		keys = append(keys, k)
	}
	return strings.Join(keys, ", ")
}

func validateTaskData(t *Task) error {
	if strings.TrimSpace(t.Task) == "" {
		return fmt.Errorf("o campo 'task' é obrigatório")
	}
	t.Status = strings.Title(t.Status)
	if t.Status != "" {
		if _, ok := ValidStatuses[t.Status]; !ok {
			return fmt.Errorf("status inválido, informe um dos seguintes: %s", getValidStatus())
		}
	}
	return nil
}

func (h *TaskHandlers) tasksHandler(res http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case "GET":
		allTasks, err := h.Repo.GetAll()
		if err != nil {
			sendJSONError(res, "Falha ao buscar tarefas.", http.StatusInternalServerError)
			return
		}
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(allTasks)

	case "POST":
		var newTask Task
		body, err := io.ReadAll(req.Body)
		if err != nil {
			sendJSONError(res, "não é possível ler os dados da requisição.", http.StatusBadRequest)
			return
		}

		if err = json.Unmarshal(body, &newTask); err != nil {
			sendJSONError(res, "dados JSON inválidos.", http.StatusBadRequest)
			return
		}

		if err = validateTaskData(&newTask); err != nil {
			sendJSONError(res, err.Error(), http.StatusBadRequest)
			return
		}

		if newTask.Status == "" {
			newTask.Status = "A Fazer"
		}

		createdTask, err := h.Repo.Create(newTask)
		if err != nil {
			sendJSONError(res, "falha ao criar a tarefa.", http.StatusInternalServerError)
			return
		}

		res.Header().Set("Content-Type", "application/json")
		res.WriteHeader(http.StatusCreated)
		json.NewEncoder(res).Encode(createdTask)

	default:
		sendJSONError(res, "método não permitido", http.StatusMethodNotAllowed)
	}
}

func (h *TaskHandlers) taskByIdHandler(res http.ResponseWriter, req *http.Request) {
	id := req.URL.Path[len("/tasks/"):]
	if id == "" {
		sendJSONError(res, "ID da tarefa não informado.", http.StatusBadRequest)
		return
	}

	task, err := h.Repo.GetById(id)
	if err != nil {
		sendJSONError(res, "tarefa não encontrada.", http.StatusNotFound)
		return
	}

	switch req.Method {
	case "GET":
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(task)
		return

	case "PUT":
		var updatedTask Task
		body, err := io.ReadAll(req.Body)
		if err != nil {
			sendJSONError(res, "não conseguimos ler os dados da requisição.", http.StatusBadRequest)
			return
		}

		if err = json.Unmarshal(body, &updatedTask); err != nil {
			sendJSONError(res, "dados JSON inválidos.", http.StatusBadRequest)
			return
		}

		if err = validateTaskData(&updatedTask); err != nil {
			sendJSONError(res, err.Error(), http.StatusBadRequest)
			return
		}

		if updatedTask.Status == "" {
			updatedTask.Status = task.Status
		}

		updatedTask, err = h.Repo.Update(id, updatedTask)
		if err != nil {
			sendJSONError(res, "falha ao atualizar a tarefa.", http.StatusInternalServerError)
			return
		}

		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(updatedTask)
		return

	case "DELETE":
		if err = h.Repo.Delete(id); err != nil {
			sendJSONError(res, "falha ao excluir a tarefa.", http.StatusInternalServerError)
			return
		}

		res.Header().Set("Content-Type", "application/json")
		res.WriteHeader(http.StatusOK)
		json.NewEncoder(res).Encode(map[string]string{"message": "tarefa com ID " + id + " foi excluída com sucesso."})
		return

	default:
		sendJSONError(res, "método não permitido para este recurso.", http.StatusMethodNotAllowed)
		return
	}
}
