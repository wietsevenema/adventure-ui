import { describe, it, expect, vi } from 'vitest';
import DropCommand from '../commands/DropCommand';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('DropCommand', () => {
  it('should execute the drop command and update history', async () => {
    const command = new DropCommand();
    const response = {
      data: {
        message: 'You dropped the item.',
      },
    };
    api.drop.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute('item1');
    command.updateHistory(result, addHistory);

    expect(api.drop).toHaveBeenCalledWith('item1');
    expect(addHistory).toHaveBeenCalledWith('You dropped the item.');
  });

  it('should provide suggestions', () => {
    const command = new DropCommand();
    const inventory = ['item1', 'item2'];

    const suggestions = command.getSuggestions('it', null, inventory);
    expect(suggestions).toEqual(['item1', 'item2']);
  });
});
