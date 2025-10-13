import { describe, it, expect, vi } from 'vitest';
import UseCommand from '../commands/UseCommand';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('UseCommand', () => {
  it('should execute the use command and update history', async () => {
    const command = new UseCommand();
    const response = {
      data: {
        message: 'You used the item.',
      },
    };
    api.use.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute('item1 on item2');
    command.updateHistory(result, addHistory);

    expect(api.use).toHaveBeenCalledWith('item1', 'item2');
    expect(addHistory).toHaveBeenCalledWith('You used the item.');
  });

  it('should provide suggestions for the first argument', () => {
    const command = new UseCommand();
    const room = {
      items: ['item1', 'item2'],
      exits: ['north'],
    };
    const inventory = ['item3'];

    const suggestions = command.getSuggestions('it', room, inventory);
    expect(suggestions).toEqual(['item1', 'item2', 'item3']);
  });

  it('should provide suggestions for the second argument', () => {
    const command = new UseCommand();
    const room = {
      items: ['item1', 'item2'],
      exits: ['north'],
    };
    const inventory = ['item3'];

    const suggestions = command.getSuggestions('item1 on it', room, inventory);
    expect(suggestions).toEqual(['item2', 'item3']);
  });
});
