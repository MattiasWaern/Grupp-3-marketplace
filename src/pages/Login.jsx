<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/auth.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
=======
import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../css/login.css';

function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Visar fel för användaren
>>>>>>> c54bc56b3913280fe8431856b1fe176c69aa2e61

  const navigate = useNavigate();

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
=======
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Återställ felmeddelande inför nytt försök
>>>>>>> c54bc56b3913280fe8431856b1fe176c69aa2e61

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

<<<<<<< HEAD
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
=======
            if (data.jwt) {
                // Spara i localStorage (Strapi v5 documentId)
                localStorage.setItem("token", data.jwt);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("userId", data.user.documentId);
                console.log("Inloggad!", data.user);

                // Kolla om det är Admin eller en vanlig användare som loggar in
                if (data.user.username === "Admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
                
                // Ladda om appen så att t.ex. Headern direkt ser inloggningen
                window.location.reload();
            } else {
                // Sätt felet direkt till statet så att användaren ser det på skärmen
                setError(data.error?.message || "Inloggningen misslyckades. Kontrollera dina uppgifter.");
                console.error("Inloggning misslyckades: ", data.error?.message);
            }
        } catch (err) {
            console.error("Något gick fel: ", err);
            setError("Kunde inte ansluta till servern, försök igen.");
        }
    };
>>>>>>> c54bc56b3913280fe8431856b1fe176c69aa2e61

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Logga in</h2>

<<<<<<< HEAD
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
=======
            {/* Input för användarnamn / e-post */}
            <input 
                type="text" 
                placeholder='E-mail eller användarnamn' 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)} 
            />

            {/* Input för lösenord (type="password" så det döljs med prickar) */}
            <input 
                type="password" 
                placeholder='Lösenord' 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
            />

            {/* Visar felmeddelande om det finns något */}
            {error && <p style={{ color: "red", fontWeight: "500" }}>{error}</p>}

            <button type='submit'>Logga in</button>

            <div className="form-footer">
                <p>Har du inget konto än?</p>
                <NavLink to="/signup" className="signup-link">
                    Skapa konto här
                </NavLink>
            </div>
        </form>
    );
>>>>>>> c54bc56b3913280fe8431856b1fe176c69aa2e61
}

Login.route = {
  path: "/login",
  index: 8,
};

export default Login;