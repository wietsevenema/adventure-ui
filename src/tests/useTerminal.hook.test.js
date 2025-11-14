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
    expect(result.current.history[0].text).toBe('Welcome to the Garden of the Forgotten Prompt!');
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
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {}, target: { value: 'command 2', setSelectionRange: vi.fn() } }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 2');
      });

      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {}, target: { value: 'command 1', setSelectionRange: vi.fn() } }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 1');
      });

      // Stays at the top
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {}, target: { value: 'command 1', setSelectionRange: vi.fn() } }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 1');
      });

      // Navigate down
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: () => {}, target: { value: 'command 2', setSelectionRange: vi.fn() } }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 2');
      });

      // Navigate down to empty input
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: () => {}, target: { value: '', setSelectionRange: vi.fn() } }); });
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
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {}, target: { value: 'command 1', setSelectionRange: vi.fn() } }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 1');
      });

      // Navigate back down
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: () => {}, target: { value: 'new input', setSelectionRange: vi.fn() } }); });
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
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {}, target: { value: 'command 2', setSelectionRange: vi.fn() } }); });
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
      await act(async () => { await result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: () => {}, target: { value: 'command 2', setSelectionRange: vi.fn() } }); });
      await waitFor(() => {
        expect(result.current.input).toBe('command 2');
      });
    });
  });

  describe('Terminal Shortcuts', () => {
    it('Ctrl+L should clear history', async () => {
      const { result } = renderHook(() => useTerminal());
      
      // Add some history
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'test' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });
      
      expect(result.current.history.length).toBeGreaterThan(0);

      // Ctrl+L
      await act(async () => {
        await result.current.handleKeyDown({ ctrlKey: true, key: 'l', preventDefault: vi.fn() });
      });

      expect(result.current.history.length).toBe(0);
    });

    it('Ctrl+L should NOT clear command history (navigation)', async () => {
      const { result } = renderHook(() => useTerminal());

      // Enter a command
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'saved command' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Clear screen
      await act(async () => {
        await result.current.handleKeyDown({ ctrlKey: true, key: 'l', preventDefault: vi.fn() });
      });

      expect(result.current.history.length).toBe(0);

      // Try to navigate back to the command
      await act(async () => {
        await result.current.handleKeyDown({ 
          key: 'ArrowUp', 
          preventDefault: vi.fn(),
          target: { value: '', setSelectionRange: vi.fn() } 
        });
      });

      expect(result.current.input).toBe('saved command');
    });

    it('Ctrl+A should move cursor to start', async () => {
      const { result } = renderHook(() => useTerminal());
      const setSelectionRange = vi.fn();
      
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'hello' } });
      });

      await act(async () => {
        await result.current.handleKeyDown({ 
          ctrlKey: true, 
          key: 'a', 
          preventDefault: vi.fn(),
          target: { setSelectionRange }
        });
      });

      expect(setSelectionRange).toHaveBeenCalledWith(0, 0);
    });

    it('Ctrl+E should move cursor to end', async () => {
      const { result } = renderHook(() => useTerminal());
      const setSelectionRange = vi.fn();
      
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'hello' } });
      });

      await act(async () => {
        await result.current.handleKeyDown({ 
          ctrlKey: true, 
          key: 'e', 
          preventDefault: vi.fn(),
          target: { setSelectionRange }
        });
      });

      expect(setSelectionRange).toHaveBeenCalledWith(5, 5);
    });

    it('Ctrl+K should kill to end', async () => {
      const { result } = renderHook(() => useTerminal());
      
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'hello world' } });
      });

      await act(async () => {
        await result.current.handleKeyDown({ 
          ctrlKey: true, 
          key: 'k', 
          preventDefault: vi.fn(),
          target: { selectionStart: 5 }
        });
      });

      expect(result.current.input).toBe('hello');
    });

    it('Ctrl+U should kill to start', async () => {
      const { result } = renderHook(() => useTerminal());
      const setSelectionRange = vi.fn();
      
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'hello world' } });
      });

      await act(async () => {
        await result.current.handleKeyDown({ 
          ctrlKey: true, 
          key: 'u', 
          preventDefault: vi.fn(),
          target: { selectionStart: 6, setSelectionRange }
        });
      });

      expect(result.current.input).toBe('world');
      
      // Wait for setTimeout
      await waitFor(() => {
        expect(setSelectionRange).toHaveBeenCalledWith(0, 0);
      });
    });

    it('Ctrl+P/N should navigate history', async () => {
      const { result } = renderHook(() => useTerminal());
      const setSelectionRange = vi.fn();

      // Add history
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd1' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd2' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Ctrl+P (Up)
      await act(async () => {
        await result.current.handleKeyDown({ 
          ctrlKey: true, 
          key: 'p', 
          preventDefault: vi.fn(),
          target: { value: 'cmd2', setSelectionRange }
        });
      });
      expect(result.current.input).toBe('cmd2');

      // Ctrl+N (Down)
      await act(async () => {
        await result.current.handleKeyDown({ 
          ctrlKey: true, 
          key: 'n', 
          preventDefault: vi.fn(),
          target: { value: 'cmd2', setSelectionRange }
        });
      });
      expect(result.current.input).toBe('');
    });
  });

  describe('Session Logging', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      api.logSession.mockResolvedValue({});
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should NOT log if sessionId is missing', async () => {
      const { result } = renderHook(() => useTerminal(null, null, null));

      await act(async () => {
        result.current.handleInputChange({ target: { value: 'test' } });
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Fast forward time
      await act(async () => {
        vi.advanceTimersByTime(6000);
      });

      expect(api.logSession).not.toHaveBeenCalled();
    });

    it('should buffer input and output logs', async () => {
      const sessionId = 'session-123';
      const { result } = renderHook(() => useTerminal(null, null, sessionId));

      // Input command
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'look' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Fast forward to trigger flush
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(api.logSession).toHaveBeenCalledTimes(1);
      const [callSessionId, logs] = api.logSession.mock.calls[0];
      expect(callSessionId).toBe(sessionId);
      
      // Expect 2 logs: 1 input ('look'), 1 output (response from api.look mock)
      expect(logs.length).toBeGreaterThanOrEqual(2);
      
      const inputLog = logs.find(l => l.type === 'in');
      expect(inputLog).toBeDefined();
      expect(inputLog.val).toBe('look');
      expect(inputLog.client).toBe('web');
      expect(inputLog.t).toBeGreaterThanOrEqual(0);

      const outputLog = logs.find(l => l.type === 'out');
      expect(outputLog).toBeDefined();
      expect(outputLog.client).toBe('web');
    });

    it('should flush logs periodically and clear buffer', async () => {
      const sessionId = 'session-123';
      const { result } = renderHook(() => useTerminal(null, null, sessionId));

      // First command
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd1' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Flush 1
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(api.logSession).toHaveBeenCalledTimes(1);
      expect(api.logSession.mock.calls[0][1].some(l => l.val === 'cmd1')).toBe(true);

      // Second command
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd2' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Flush 2
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(api.logSession).toHaveBeenCalledTimes(2);
      // Second flush should NOT contain cmd1
      expect(api.logSession.mock.calls[1][1].some(l => l.val === 'cmd1')).toBe(false);
      expect(api.logSession.mock.calls[1][1].some(l => l.val === 'cmd2')).toBe(true);
    });

    it('should NOT call API if buffer is empty', async () => {
      const sessionId = 'session-123';
      renderHook(() => useTerminal(null, null, sessionId));

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(api.logSession).not.toHaveBeenCalled();
    });

    it('should skip flush if previous flush is in progress', async () => {
      const sessionId = 'session-123';
      let resolveFlush;
      api.logSession.mockImplementation(() => new Promise(resolve => { resolveFlush = resolve; }));

      const { result } = renderHook(() => useTerminal(null, null, sessionId));

      // Add log
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd1' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Trigger first flush (starts but hangs)
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(api.logSession).toHaveBeenCalledTimes(1);

      // Add another log
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd2' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Trigger second flush (should be skipped)
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(api.logSession).toHaveBeenCalledTimes(1);

      // Resolve the first flush
      await act(async () => {
        resolveFlush({});
      });

      // Trigger third flush (should now proceed with cmd2)
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(api.logSession).toHaveBeenCalledTimes(2);
      expect(api.logSession.mock.calls[1][1].some(l => l.val === 'cmd2')).toBe(true);
    });

    it('should re-queue logs if API call fails', async () => {
      const sessionId = 'session-123';
      // First call fails, second succeeds
      api.logSession
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({});

      const { result } = renderHook(() => useTerminal(null, null, sessionId));

      // Add log
      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd1' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      // Trigger flush (fails)
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(api.logSession).toHaveBeenCalledTimes(1);

      // Trigger next flush (should retry cmd1)
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      expect(api.logSession).toHaveBeenCalledTimes(2);
      expect(api.logSession.mock.calls[1][1].some(l => l.val === 'cmd1')).toBe(true);
    });

    it('should flush logs on unmount', async () => {
      const sessionId = 'session-123';
      const { result, unmount } = renderHook(() => useTerminal(null, null, sessionId));

      await act(async () => {
        result.current.handleInputChange({ target: { value: 'cmd1' } });
      });
      await act(async () => {
        await result.current.handleKeyDown({ key: 'Enter' });
      });

      unmount();

      expect(api.logSession).toHaveBeenCalledTimes(1);
      expect(api.logSession.mock.calls[0][1].some(l => l.val === 'cmd1')).toBe(true);
    });
  });

  it('should set isLevelComplete to true when quit command is executed', async () => {
    const { result } = renderHook(() => useTerminal());

    await act(async () => {
      result.current.handleInputChange({ target: { value: 'quit' } });
    });
    await act(async () => {
      await result.current.handleKeyDown({ key: 'Enter' });
    });

    await waitFor(() => {
      expect(result.current.isLevelComplete).toBe(true);
    });
  });
});