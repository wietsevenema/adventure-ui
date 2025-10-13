import { describe, it, expect, vi } from 'vitest';
import ExamineCommand from '../commands/ExamineCommand';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('ExamineCommand', () => {
  it('should execute the examine command and update history', async () => {
    const command = new ExamineCommand();
    const response = {
      data: {
        description: 'A test item',
      },
    };
    api.examine.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute('item1');
    command.updateHistory(result, addHistory);

    expect(api.examine).toHaveBeenCalledWith('item1');
    expect(addHistory).toHaveBeenCalledWith('A test item');
  });

  it('should provide suggestions', () => {
    const command = new ExamineCommand();
    const room = {
      items: ['item1', 'item2'],
      exits: ['north', 'south'],
    };
    const inventory = ['item3'];

    const suggestions = command.getSuggestions('it', room, inventory);
    expect(suggestions).toEqual(['item1', 'item2', 'item3']);
  });
});
