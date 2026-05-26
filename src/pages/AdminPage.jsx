import { useState, useEffect } from "react";
import "../css/adminpage.css";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    // hämtar alla användare vid start
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:1337/api/admin-users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if(!response.ok) {
                setError("Kunde inte hämta användare.");
                return;
            }

            setUsers(data);
        } catch (err) {
            setError("Något gick fel");
            console.error(err);
        }
    };

    const handleToggleBlock = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:1337/api/admin-users/${id}/toggle-block`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setError("Kunde inte uppdatera användaren");
                return;
            }

            const updated = await response.json();

            setUsers(users.map(user => user.id === updated.id ? {...user, blocked: updated.blocked } : user      
            ));
        } catch (err) {
            setError("Något gick fel");
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Admin - Användare</h2>

            {error && <p className="error-message">{error}</p>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Användarnamn</th>
                        <th>E-mail</th>
                        <th>Roll</th>
                        <th>Status</th>
                        <th>Åtgärd</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role?.name || "Ingen roll"}</td>
                            <td>
                                <span className={user.blocked ? "status-blocked" : "status-active"}>
                                    {user.blocked ? "Avstängd" : "Aktiv" }
                                </span>
                            </td>
                            <td>
                                <button className={user.blocked ? "btn-active" : "btn-block"}
                                    onClick={() => handleToggleBlock(user.id)}>
                                    {user.blocked ? "Aktivera" : "Stäng av"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

AdminPage.route = {
    path: '/admin',
    index: 10,
};

export default AdminPage;