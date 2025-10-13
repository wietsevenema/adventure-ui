import { describe, it, expect, vi } from 'vitest';
import HelpCommand from '../commands/HelpCommand';

describe('HelpCommand', () => {
  it('should update history with the help message', () => {
    const command = new HelpCommand();
    const addHistory = vi.fn();
    command.updateHistory(null, addHistory);

    expect(addHistory).toHaveBeenCalledWith('Available commands: look, inventory, examine [thing], move [exit], take [item], use [item] on [thing], drop [item], help');
  });
});
