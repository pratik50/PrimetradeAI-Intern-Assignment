import { MessageBanner } from "./MessageBanner";

export function Dashboard({
  user,
  message,
  error,
  taskForm,
  tasks,
  onLogout,
  onTaskChange,
  onCreateTask,
  onUpdateStatus,
  onDeleteTask,
}) {
  return (
    <section className="card">
      <div className="header-row">
        <div>
          <h1>Dashboard</h1>
          <p className="subtext">{user ? `${user.name} (${user.role})` : "Loading user..."}</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </div>

      <MessageBanner message={message} error={error} />

      <form className="form" onSubmit={onCreateTask}>
        <h2>Create Task</h2>
        <input
          name="title"
          placeholder="Task title"
          value={taskForm.title}
          onChange={onTaskChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task description (optional)"
          value={taskForm.description}
          onChange={onTaskChange}
          rows={3}
        />
        <button type="submit">Create Task</button>
      </form>

      <section className="task-list">
        <h2>Tasks</h2>
        {tasks.length === 0 ? (
          <p className="subtext">No tasks found</p>
        ) : (
          tasks.map((task) => (
            <article className="task-item" key={task.id}>
              <div>
                <strong>{task.title}</strong>
                <p>{task.description || "No description"}</p>
              </div>
              <div className="task-actions">
                <select value={task.status} onChange={(event) => onUpdateStatus(task.id, event.target.value)}>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                <button onClick={() => onDeleteTask(task.id)}>Delete</button>
              </div>
            </article>
          ))
        )}
      </section>
    </section>
  );
}
