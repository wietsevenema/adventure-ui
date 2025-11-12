import { describe, it, expect, vi } from 'vitest';
import LookCommand from '../commands/LookCommand';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('LookCommand', () => {
  it('should execute the look command and update history', async () => {
    const command = new LookCommand();
    const response = {
      data: {
        name: 'Test Room',
        description: 'A test room',
      },
    };
    api.look.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute();
    command.updateHistory(result, addHistory);

    expect(api.look).toHaveBeenCalled();
    expect(addHistory).toHaveBeenCalledWith('# Room: Test Room');
    expect(addHistory).toHaveBeenCalledWith('A test room');
  });
});
