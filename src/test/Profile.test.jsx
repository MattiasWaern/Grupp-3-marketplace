import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../pages/Profile.jsx';

beforeEach(() => {
  const mockUser = { id: 1, username: 'TestUser', email: 'test@test.com' };
  localStorage.setItem('user', JSON.stringify(mockUser));
  localStorage.setItem('token', 'fake-token');

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: [] }),
  });
});

describe('Profile', () => {
  it('shows the copyright text', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Min Profil')).toBeInTheDocument();
    });
  });
});