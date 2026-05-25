import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
          "Content-type": "application/json",
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
        console.log("Inloggad!", data.user);
        navigate("/");
      } else {
        setError(data.error?.message || "Inloggning misslyckades.");
      }
    } catch (err) {
      console.error("Något gick fel: ", err);
      setError("Kunde inte ansluta till servern, försök igen.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Logga in</h2>

        {error && <p className="auth-error">{error}</p>}

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

        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

Login.route = {
  path: "/login",
  index: 8,
};

export default Login;