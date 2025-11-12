import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('App', () => {
  it('renders the Level Select component initially', async () => {
    api.listLevels.mockResolvedValue({ data: [] });
    render(<App />);
    // It might show "Loading levels..." first
    expect(screen.getByText(/Loading levels/i)).toBeInTheDocument();
    
    // Then it should show SELECT LEVEL once it "loads" (even empty list)
    await waitFor(() => {
        expect(screen.getByText('SELECT LEVEL')).toBeInTheDocument();
    });
  });
});