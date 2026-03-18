export function MessageBanner({ message, error }) {
  return (
    <>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </>
  );
}
