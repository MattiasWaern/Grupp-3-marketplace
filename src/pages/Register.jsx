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
}

export default Register;