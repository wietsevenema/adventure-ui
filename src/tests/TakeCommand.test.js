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
    const room = {
      items: ['item1', 'item2'],
    };

    const suggestions = command.getSuggestions('it', room, []);
    expect(suggestions).toEqual(['item1', 'item2']);
  });

  it('should provide suggestions with multiple words', () => {
    const command = new TakeCommand();
    const room = {
      items: ['long item name', 'item2'],
    };

    const suggestions = command.getSuggestions('long it', room, []);
    expect(suggestions).toEqual(['long item name']);
  });
});
