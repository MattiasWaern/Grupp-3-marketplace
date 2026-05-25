import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../css/auth.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.documentId);

        if (data.user.username === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        window.location.reload();
      } else {
        setError(
          data.error?.message ||
            "Inloggningen misslyckades. Kontrollera dina uppgifter."
        );
      }
    } catch (err) {
      console.error("Något gick fel:", err);
      setError("Kunde inte ansluta till servern, försök igen.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Logga in</h2>

        <input
          type="text"
          placeholder="E-mail eller användarnamn"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Logga in</button>

        <div className="form-footer">
          <p>Har du inget konto än?</p>
          <NavLink to="/signup" className="signup-link">
            Skapa konto här
          </NavLink>
        </div>
      </form>
    </div>
  );
}

Login.route = {
  path: "/login",
  index: 8,
};

export default Login;