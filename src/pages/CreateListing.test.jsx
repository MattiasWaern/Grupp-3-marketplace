import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import CreateListing from './CreateListing';


const localStorageMock = (() => {
  let store = {
    token: 'fake-token-123',
    userId: 'user-456'
  };
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

global.localStorage = localStorageMock;


global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: { id: 1 } }),
  })
);


global.URL.createObjectURL = vi.fn(() => 'mock-image-url');
global.URL.revokeObjectURL = vi.fn();

describe('CreateListing - Verifiera beteende', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token-123';
      if (key === 'userId') return 'user-456';
      return null;
    });
    render(<CreateListing />);
  });

  
  it('visar underkategorier ENDAST när Kläder är vald', () => {
    
    fireEvent.click(screen.getByText('Elektronik'));
    expect(screen.queryByText('Herr')).not.toBeInTheDocument();
    
    
    fireEvent.click(screen.getByText('Kläder'));
    expect(screen.getByText('Herr')).toBeInTheDocument();
    expect(screen.getByText('Dam')).toBeInTheDocument();
    expect(screen.getByText('Barn')).toBeInTheDocument();
  });


  it('skickar med vald underkategori i API-anropet', async () => {
    
    fireEvent.change(screen.getByPlaceholderText('Ange en tydlig titel'), { target: { value: 'Test produkt' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '299' } });
    
   
    fireEvent.click(screen.getByText('Kläder'));
    
    await waitFor(() => {
      expect(screen.getByText('Herr')).toBeInTheDocument();
    });
    
    
    fireEvent.click(screen.getByText('Dam'));
    
    
    fireEvent.click(screen.getByRole('button', { name: /skapa annons/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    
    const fetchCall = global.fetch.mock.calls.find(call => call[0] === 'http://localhost:1337/api/listings');
    expect(fetchCall).toBeDefined();
    const requestBody = JSON.parse(fetchCall[1].body);
    expect(requestBody.data.subcategory).toBe('Dam');
  });


  it('nollställer underkategori när man byter från Kläder till Elektronik', async () => {
    
    fireEvent.click(screen.getByText('Kläder'));
    
    await waitFor(() => {
      expect(screen.getByText('Herr')).toBeInTheDocument();
    });
    
    
    fireEvent.click(screen.getByText('Herr'));
    
    
    fireEvent.click(screen.getByText('Elektronik'));
    
    
    fireEvent.click(screen.getByText('Kläder'));
    
    await waitFor(() => {
      expect(screen.getByText('Herr')).toBeInTheDocument();
    });
    
    
    fireEvent.change(screen.getByPlaceholderText('Ange en tydlig titel'), { target: { value: 'Test produkt' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '299' } });
    
    
    fireEvent.click(screen.getByRole('button', { name: /skapa annons/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    
    const fetchCall = global.fetch.mock.calls.find(call => call[0] === 'http://localhost:1337/api/listings');
    expect(fetchCall).toBeDefined();
    const requestBody = JSON.parse(fetchCall[1].body);
    expect(requestBody.data.subcategory).toBe('');
  });
});