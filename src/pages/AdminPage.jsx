import { useState, useEffect } from "react";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    // hämtar alla användare vid start
    useEffect(() => {
        fetchUsers();
    }, []);
}

AdminPage.route = {
    path: '/admin',
    index: 10,
};

export default AdminPage;