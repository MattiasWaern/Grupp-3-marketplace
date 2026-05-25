import { useState, useEffect } from "react";

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
    
}

AdminPage.route = {
    path: '/admin',
    index: 10,
};

export default AdminPage;