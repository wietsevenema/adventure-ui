import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

  it('starts a level and displays the formatted welcome message', async () => {
    const mockLevel = {
      id: 'level-0',
      name: 'Level 0: The Digital Twin',
      state: 'available',
      description: 'Test Level'
    };
    
    api.listLevels.mockResolvedValue({ data: [mockLevel] });
    api.startLevel.mockResolvedValue({ data: { intro_text: [] } });
    api.look.mockResolvedValue({ 
      data: { name: 'Start Room', description: 'You are here.' } 
    });

    render(<App />);

    const levelButton = await waitFor(() => screen.getByText('Level 0: The Digital Twin'));
    fireEvent.click(levelButton);

    await waitFor(() => {
      // Check for the formatted title and underline in the output using a regex for flexibility with whitespace
      expect(screen.getByText(/Level 0: The Digital Twin\s+=+\s+-> Type 'help' to list commands/)).toBeInTheDocument();
    });
  });
});