import { useState } from 'react';

function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

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
                console.log("Inloggad!", data.user);
            } else {
                console.error("Inloggning misslyckades: ", data.error?.message);
            }
        } catch (err) {
            console.error("Något gick fel: ", err);
        }
    };
}
