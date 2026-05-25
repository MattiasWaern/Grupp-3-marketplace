import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.documentId);
        navigate("/");
      }
    } catch (err) {
      console.error("Något gick fel: ", err);
      setError("Kunde inte ansluta till servern, försök igen.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Skapa konto</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Skapa konto</button>
      </form>
    </div>
  );
}

Register.route = {
  path: "/signup",
  index: 2,
};

export default Register;