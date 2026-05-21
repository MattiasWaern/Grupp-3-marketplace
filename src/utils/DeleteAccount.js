export async function deleteAccount(token) {
  const response = await fetch(
    'http://localhost:1337/api/account',
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
  }
  );
  if (!response.ok) {
    throw new Error('Kunde inte radera konto');
  }
  return response.json();
}