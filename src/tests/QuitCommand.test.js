import { describe, it, expect, vi } from 'vitest';
import QuitCommand from '../commands/QuitCommand';

describe('QuitCommand', () => {
  it('should return level_complete: true on execute', async () => {
    const command = new QuitCommand();
    const result = await command.execute();
    expect(result).toEqual({ data: { level_complete: true } });
  });

  it('should update history with the quitting message', () => {
    const command = new QuitCommand();
    const addHistory = vi.fn();
    command.updateHistory(null, addHistory);

    expect(addHistory).toHaveBeenCalledWith('Quitting level...');
  });
});
