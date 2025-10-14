import { describe, it, expect, vi } from 'vitest';
import Command from '../commands/Command';

describe('Command', () => {
  it('should return an empty array for suggestions', () => {
    const command = new Command('test');
    expect(command.getSuggestions()).toEqual([]);
  });

  it('should call addHistory with the response', () => {
    const command = new Command('test');
    const addHistory = vi.fn();
    command.updateHistory('test response', addHistory);
    expect(addHistory).toHaveBeenCalledWith('test response');
  });
});
