import { useState } from 'react';
import { useNavigate } from "react-router-dom"

function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    // användaren ser fel och inte bara i konsolen
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
                
                    // enkel men mindre bra lösning, kollar bara om användarnamnet är Admin
                    if (data.user.username === "Admin") {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                }

        } catch (err) {
            console.error("Något gick fel: ", err);
            setError("Kunde inte ansluta till servern, försök igen.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Logga in</h2>

            {error && <p style= {{ color: "red" }}>{error}</p>}

            <input type="text" placeholder='E-mail eller användarnamn' value={identifier}
            onChange={(e) => setIdentifier(e.target.value)} />
            <input type="password" placeholder='Lösenord' value={password}
            onChange={(e) => setPassword(e.target.value)} />

            <button type='submit'>Logga in</button>
        </form>

    );
}

Login.route = {
    path: '/login',
    index: 8,
};

export default Login;