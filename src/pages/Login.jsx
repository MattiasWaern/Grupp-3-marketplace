import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                window.location.reload();
            } else {
                console.error("Inloggning misslyckades: ", data.error?.message);
            }
        } catch (err) {
            console.error("Något gick fel: ", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Logga in</h2>

            <input 
            type="text" 
            placeholder='E-mail eller användarnamn' 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)} 
            />

            <input 
            type="text" 
            placeholder='Lösenord' 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            />

            <button type='submit'>Logga in</button>
        </form>

    );
}

Login.route = {
    path: '/login',
    index: 8,
};

export default Login;