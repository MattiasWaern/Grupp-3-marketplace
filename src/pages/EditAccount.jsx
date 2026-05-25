import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EditAccount() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:1337/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setFormData({
                    username: data.username || "",
                    email: data.email || "",
                    password: "",
                });
            } catch (err) {
                setError("Kunde inte hämta användaruppgifter");
            }
        };
        fetchUser();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:1337/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    ...(formData.password && { password: formData.password }),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setSuccess("Dina uppgifter har uppdaterats!");
            setTimeout(() => navigate("/"), 2000);

        } catch (err) {
            setError("Kunde inte uppdatera uppgifterna. Försök igen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-listing-container" style={{ marginTop: "150px" }}>
            <h1>Ändra kontouppgifter</h1>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Användarnamn</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>E-post</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nytt lösenord (lämna tomt om du inte vill byta)</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Sparar..." : "Spara ändringar"}
                </button>
            </form>
        </div>
    );
}
EditAccount.route = {
    path: "/editaccount",
    index: 8,
};

export default EditAccount;