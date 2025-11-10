import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTerminal } from '../hooks/useTerminal.jsx';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('useTerminal Hook', () => {
  beforeEach(() => {
    api.look.mockResolvedValue({ data: { name: 'Test Room', description: 'A room for testing.' } });
    api.inventory.mockResolvedValue({ data: { inventory: [] } });
    localStorage.setItem('apiKey', 'test-key');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem('apiKey');
  });

  it('should initialize with a welcome message', () => {
    const { result } = renderHook(() => useTerminal());
    expect(result.current.history[0].text).toBe('Welcome to the Temple of the Forgotten Prompt!');
  });

  it('should add a command to history on Enter', async () => {
    const { result } = renderHook(() => useTerminal());

    await act(async () => {
      result.current.handleInputChange({ target: { value: 'test command' } });
    });
    await waitFor(() => expect(result.current.input).toBe('test command'));

    await act(async () => {
      await result.current.handleKeyDown({ key: 'Enter' });
    });

    await waitFor(() => {
      expect(result.current.history.some(h => h.text === 'test command' && h.type === 'command')).toBe(true);
      expect(result.current.input).toBe('');
    });
  });

  describe('Command History Navigation', () => {
    it('should cycle through history', async () => {
      const { result } = renderHook(() => useTerminal());

      // Add two commands to history
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'command 1' } });
      });
      await waitFor(() => expect(result.current.input).toBe('command 1'));
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });
      await waitFor(() => expect(result.current.history.filter(h => h.type === 'command').length).toBe(1));

      await act(async () => {
        result.current.handleInputChange({ target: { value: 'command 2' } });
      });
      await waitFor(() => expect(result.current.input).toBe('command 2'));
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });
      await waitFor(() => expect(result.current.history.filter(h => h.type === 'command').length).toBe(2));

      // Navigate up
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 2');
      });

      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 1');
      });

      // Stays at the top
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 1');
      });

      // Navigate down
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 2');
      });

      // Navigate down to empty input
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('');
      });
    });

    it('should restore staged input when navigating down past the end of history', async () => {
      const { result } = renderHook(() => useTerminal());

      await act(async () => {
        result.current.handleInputChange({ target: { value: 'command 1' } });
      });
      await waitFor(() => expect(result.current.input).toBe('command 1'));
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });
      await waitFor(() => expect(result.current.history.filter(h => h.type === 'command').length).toBe(1));

      // Type something new but don't enter
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'new input' } });
      });
      await waitFor(() => expect(result.current.input).toBe('new input'));

      // Navigate up into history
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 1');
      });

      // Navigate back down
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('new input');
      });
    });

    it('should reset history navigation when user types', async () => {
      const { result } = renderHook(() => useTerminal());

      // Add two commands
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'command 1' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'command 2' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });
      await waitFor(() => expect(result.current.history.filter(h => h.type === 'command').length).toBe(2));

      // Navigate up
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 2');
      });

      // Start typing
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'edit' } });
      });
      await waitFor(() => {
        expect(result.current.input).toBe('edit');
      });
      
      // Navigate up again, should start from the end (command 2)
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {} }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 2');
      });
    });
  });
});
