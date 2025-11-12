import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTerminal } from '../hooks/useTerminal.jsx';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('useTerminal Hook Whitespace Handling', () => {
  beforeEach(() => {
    api.look.mockResolvedValue({ data: { name: 'Test Room', description: 'A room for testing.' } });
    api.use.mockResolvedValue({ data: { message: 'You used the item.' } });
    localStorage.setItem('apiKey', 'test-key');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem('apiKey');
  });

  it('should handle leading and trailing whitespace in commands', async () => {
    const { result } = renderHook(() => useTerminal());

    await act(async () => {
      result.current.handleInputChange({ target: { value: '   look   ' } });
    });
    await act(async () => {
      await result.current.handleKeyDown({ key: 'Enter' });
    });

    await waitFor(() => {
      expect(api.look).toHaveBeenCalled();
    });
  });

  it('should handle multiple spaces between command and arguments', async () => {
    const { result } = renderHook(() => useTerminal());

    // Assuming 'use' command is registered and calls api.use
    // We need to make sure the command registry has 'use'. 
    // The hook imports the real registry, which imports real commands.
    
    await act(async () => {
      result.current.handleInputChange({ target: { value: '  use   flint   on   striker  ' } });
    });
    await act(async () => {
      await result.current.handleKeyDown({ key: 'Enter' });
    });

    await waitFor(() => {
      // The UseCommand splits by ' on ', so we need to verify what it received.
      // If processCommand splits by \s+, it passes "flint on striker" to UseCommand.
      // UseCommand splits "flint on striker" by " on " -> "flint", "striker".
      expect(api.use).toHaveBeenCalledWith('flint', 'striker');
    });
  });
});
