import { useState } from "react";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            // här kan token läggas till när inlogg finns
            console.log(data);
        } catch (err) {
            console.error("Något gick fel: ", err);
        }
    };

    // alt. handleChange?

    // formuläret för registeringen
    return (
        <form onSubmit={handleSubmit}>

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
    path: '/register',
    index: 2,
};

export default Register;