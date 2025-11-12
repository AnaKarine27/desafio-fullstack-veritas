const API_BASE_URL = "http://localhost:3333/tasks";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(
      errorData.error || `HTTP error! Status: ${response.status}`,
      response.status
    );
  }
  return response.json();
};

const apiClient = async (endpoint = "", options = {}) => {
  const defaultHeaders = { "Content-Type": "application/json" };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (
    config.body &&
    typeof config.body !== "string" &&
    config.headers["Content-Type"] === "application/json"
  ) {
    config.body = JSON.stringify(config.body);
  }

  const url = `${API_BASE_URL}${endpoint ? "/" + endpoint : ""}`;

  const response = await fetch(url, config);
  return handleResponse(response);
};

export const fetchTasks = () => {
  return apiClient();
};

export const createTask = (taskData) => {
  return apiClient("", {
    method: "POST",
    body: taskData,
  });
};

export const updateTask = (id, taskData) => {
  return apiClient(id, {
    method: "PUT",
    body: taskData,
  });
};

export const deleteTask = (id) => {
  return apiClient(id, {
    method: "DELETE",
  });
};