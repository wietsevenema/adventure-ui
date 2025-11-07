import { describe, it, expect, vi } from 'vitest';
import TakeCommand from '../commands/TakeCommand';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('TakeCommand', () => {
  it('should execute the take command and update history', async () => {
    const command = new TakeCommand();
    const response = {
      data: {
        message: 'You took the item.',
      },
    };
    api.take.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute('item1');
    command.updateHistory(result, addHistory);

    expect(api.take).toHaveBeenCalledWith('item1');
    expect(addHistory).toHaveBeenCalledWith('You took the item.');
  });

  it('should provide suggestions', () => {
    const command = new TakeCommand();
    const room = {};

    const suggestions = command.getSuggestions('it', room, []);
    expect(suggestions).toEqual([]);
  });
});
