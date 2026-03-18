import { MessageBanner } from "./MessageBanner";

export function AuthCard({
  authMode,
  authForm,
  loading,
  message,
  error,
  onAuthChange,
  onAuthSubmit,
  onToggleMode,
}) {
  return (
    <section className="card">
      <h1>{authMode === "register" ? "Create Account" : "Login"}</h1>
      <p className="subtext">Simple frontend for testing backend APIs</p>

      <MessageBanner message={message} error={error} />

      <form className="form" onSubmit={onAuthSubmit}>
        {authMode === "register" && (
          <input
            name="name"
            placeholder="Name"
            value={authForm.name}
            onChange={onAuthChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={authForm.email}
          onChange={onAuthChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={onAuthChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : authMode === "register" ? "Register" : "Login"}
        </button>
      </form>

      <button className="link-button" onClick={onToggleMode}>
        {authMode === "login" ? "New user? Register" : "Already registered? Login"}
      </button>
    </section>
  );
}
