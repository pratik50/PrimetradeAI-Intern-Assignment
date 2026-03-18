import { useEffect, useState } from "react";
import "./App.css";
import { AuthCard } from "./components/AuthCard";
import { Dashboard } from "./components/Dashboard";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showMessage = (value) => {
    setMessage(value);
    setError("");
  };

  const showError = (value) => {
    setError(value);
    setMessage("");
  };

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

  const {
    token,
    user,
    authMode,
    authForm,
    loading,
    handleAuthChange,
    toggleAuthMode,
    handleAuthSubmit,
    loadCurrentUser,
    logout,
  } = useAuth({ showMessage, showError, clearAlerts });

  const {
    tasks,
    taskForm,
    handleTaskChange,
    handleCreateTask,
    handleUpdateStatus,
    handleDeleteTask,
    refreshTasks,
    clearTasks,
  } = useTasks({ token, showMessage, showError });

  useEffect(() => {
    if (!token) {
      clearTasks();
      return;
    }

    void loadCurrentUser(token);
    void refreshTasks(token);
  }, [token]);

  const handleLogout = () => {
    logout();
    clearTasks();
  };

  if (!token) {
    return (
      <main className="app-shell">
        <AuthCard
          authMode={authMode}
          authForm={authForm}
          loading={loading}
          message={message}
          error={error}
          onAuthChange={handleAuthChange}
          onAuthSubmit={handleAuthSubmit}
          onToggleMode={toggleAuthMode}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Dashboard
        user={user}
        message={message}
        error={error}
        taskForm={taskForm}
        tasks={tasks}
        onLogout={handleLogout}
        onTaskChange={handleTaskChange}
        onCreateTask={handleCreateTask}
        onUpdateStatus={handleUpdateStatus}
        onDeleteTask={handleDeleteTask}
      />
    </main>
  );
}

export default App;
