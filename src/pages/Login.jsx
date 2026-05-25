import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../css/login.css';

function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Visar fel för användaren

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Återställ felmeddelande inför nytt försök

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

    return (
        <form onSubmit={handleSubmit}>
            <h2>Logga in</h2>

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
}

Login.route = {
    path: '/login',
    index: 8,
};

export default Login;