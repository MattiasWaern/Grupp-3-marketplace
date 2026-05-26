import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// Rensar localStorage innan varje test
beforeEach(() => {
    localStorage.clear();
});

describe('Login', () => {
    it('sparar JWT i localStorage vid lyckad inloggning', async () => {
        // Mockar ett lyckat svar från Strapi
        global.fetch = vi.fn().mockResolvedValue({
            json: async () => ({
                jwt: 'test-token-123',
                user: { id: 1, documentId: 'abc', username: 'testuser' },
            }),
        });

        // MemoryRouter behövs eftersom Login använder useNavigate
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('E-mail eller användarnamn'), {
            target: { value: 'test@test.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Lösenord'), {
            target: { value: 'hemligt123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /logga in/i }));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('test-token-123');
        });
    });

    it('sparar INTE token om inloggning misslyckas', async () => {
        // Mockar ett misslyckat svar från Strapi
        global.fetch = vi.fn().mockResolvedValue({
            json: async () => ({
                error: { message: 'Invalid credentials' },
            }),
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /logga in/i }));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeNull();
        });
    });
});