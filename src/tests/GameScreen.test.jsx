import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameScreen from '../components/GameScreen';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('GameScreen Component', () => {
  beforeEach(() => {
    api.look.mockResolvedValue({ data: { name: 'Test Room', description: 'A room for testing.' } });
    api.inventory.mockResolvedValue({ data: { inventory: [] } });
    localStorage.setItem('apiKey', 'test-key');
  });

  it('renders the initial welcome message', () => {
    render(<GameScreen />);
    expect(screen.getByText('Welcome to the Garden of the Forgotten Prompt!')).toBeInTheDocument();
  });
});
