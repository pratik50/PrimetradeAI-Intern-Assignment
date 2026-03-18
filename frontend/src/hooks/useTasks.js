import { useState } from "react";
import { apiRequest } from "../api/client";

const initialTaskForm = { title: "", description: "" };

export function useTasks({ token, showMessage, showError }) {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(initialTaskForm);

  const refreshTasks = async (currentToken = token) => {
    if (!currentToken) return;

    try {
      const response = await apiRequest("/tasks", { token: currentToken });
      setTasks(response.data || []);
    } catch (err) {
      showError(err.message);
    }
  };

  const clearTasks = () => {
    setTasks([]);
    setTaskForm(initialTaskForm);
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!token) return;

    try {
      const response = await apiRequest("/tasks", {
        method: "POST",
        token,
        body: taskForm,
      });

      setTaskForm(initialTaskForm);
      showMessage(response.message);
      await refreshTasks(token);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    if (!token) return;

    try {
      const response = await apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        token,
        body: { status },
      });

      showMessage(response.message);
      await refreshTasks(token);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!token) return;

    try {
      const response = await apiRequest(`/tasks/${taskId}`, {
        method: "DELETE",
        token,
      });

      showMessage(response.message);
      await refreshTasks(token);
    } catch (err) {
      showError(err.message);
    }
  };

  return {
    tasks,
    taskForm,
    handleTaskChange,
    handleCreateTask,
    handleUpdateStatus,
    handleDeleteTask,
    refreshTasks,
    clearTasks,
  };
}
