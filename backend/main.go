package main

import (
	"fmt"
	"net/http"
)

func main() {
	repository := NewInMemoryTaskRepository("tasks.json")

	taskHandlers := &TaskHandlers{
		Repo: repository,
	}

	http.HandleFunc("/tasks", taskHandlers.tasksHandler)
	http.HandleFunc("/tasks/", taskHandlers.taskByIdHandler)

	handler := enableCORS(http.DefaultServeMux)

	fmt.Println("Aplicação rodando na porta :3333...")

	err := http.ListenAndServe(":3333", handler)

	if err != nil {
		fmt.Println("Erro ao iniciar a aplicação:", err)
	}
}
