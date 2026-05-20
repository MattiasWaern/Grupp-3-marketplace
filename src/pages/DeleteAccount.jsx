import { deleteAccount } from "../utils/DeleteAccount";

export default function DeleteAccount() {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('jwt');

      await deleteAccount(token);

      localStorage.removeItem('jwt');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      <h2>Radera konto</h2>

      <button onClick={handleDelete}>
        Radera konto permanent
      </button>
    </section>
  )

  DeleteAccount.route = {
    path: '/deleteaccount',
    label: 'Delete Account',
    index: 6,
  };
  
}