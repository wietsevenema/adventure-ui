import { describe, it, expect, vi } from 'vitest';
import Command from '../commands/Command';

describe('Command', () => {
  it('should call addHistory with the response', () => {
    const command = new Command('test');
    const addHistory = vi.fn();
    command.updateHistory('test response', addHistory);
    expect(addHistory).toHaveBeenCalledWith('test response');
  });
});
