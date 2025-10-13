import { describe, it, expect, vi } from 'vitest';
import InventoryCommand from '../commands/InventoryCommand';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('InventoryCommand', () => {
  it('should execute the inventory command and update history', async () => {
    const command = new InventoryCommand();
    const response = {
      data: {
        inventory: ['item1', 'item2'],
      },
    };
    api.inventory.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute();
    command.updateHistory(result, addHistory);

    expect(api.inventory).toHaveBeenCalled();
    expect(addHistory).toHaveBeenCalledWith('Inventory: item1, item2');
  });

  it('should handle an empty inventory', async () => {
    const command = new InventoryCommand();
    const response = {
      data: {
        inventory: [],
      },
    };
    api.inventory.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute();
    command.updateHistory(result, addHistory);

    expect(api.inventory).toHaveBeenCalled();
    expect(addHistory).toHaveBeenCalledWith('Inventory: empty');
  });
});
