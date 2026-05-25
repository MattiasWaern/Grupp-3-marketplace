import { useState } from "react";
import { useNavigate } from "react-router-dom"

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // för felmeddelanden istället för i konsolen
    const [error, setError] = useState("");

    const navigate = useNavigate();
    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // återställning av tidigare felmeddelanden vid nytt försök
        setError ("");

        // trycatch
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
            // returnerar data.error om något går fel
            if (data.error) {
                setError(data.error.message);
                return;
            }

            // spara token direkt och navigera vidare
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

    // formuläret för registeringen
    return (
        <form onSubmit={handleSubmit}>

            {error && <p style={{ color: "red" }}> {error}</p>}

            <h2>Skapa konto</h2>

            <input type="text" placeholder="Användarnamn" value={username} 
            onChange={(e) => setUsername(e.target.value)} />

            <input type="email" placeholder="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />

            <input type="password" placeholder="Lösenord" value={password}
            onChange={(e) => setPassword(e.target.value)} />

            <button type="submit">Skapa konto</button>

        </form>
    )
}

Register.route = {
    path: '/signup',
    index: 2,
};

export default Register;