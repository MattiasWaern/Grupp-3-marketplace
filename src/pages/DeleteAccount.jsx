import { useNavigate } from "react-router";

export default function DeleteAccount() {
  const navigate = useNavigate();

  async function handleDelete() {
    try {
      const userResponse = await fetch(
        "http://localhost:1337/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = await userResponse.json();

      const deleteResponse = await fetch(
        `http://localhost:1337/api/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!deleteResponse.ok) {
        throw new Error("Kunde inte radera konto");
      }

      localStorage.removeItem("jwt");

      navigate("/");
    } catch (error) {
      console.error("Fel vid borttagning av konto:", error);
    }
  }

  return (
    <section>
      <h2>Radera konto</h2>

      <p>Detta går inte att ångra</p>

      <button onClick={handleDelete}>
        Radera kontot permanent
      </button>
    </section>
  )

  DeleteAccount.route = {
    path: '/deleteaccount',
    label: 'Delete Account',
    index: 6,
  };
  
}