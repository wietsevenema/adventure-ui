import { describe, it, expect, vi } from 'vitest';
import MoveCommand from '../commands/MoveCommand';
import * as api from '../api/ApiService';

vi.mock('../api/ApiService');

describe('MoveCommand', () => {
  it('should execute the move command and update history for a normal room', async () => {
    const command = new MoveCommand();
    const response = {
      data: {
        name: 'New Room',
        description: 'A new room',
      },
    };
    api.move.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute('north');
    command.updateHistory(result, addHistory);

    expect(api.move).toHaveBeenCalledWith('north');
    expect(addHistory).toHaveBeenCalledWith('Room: New Room');
    expect(addHistory).toHaveBeenCalledWith('A new room');
  });

  it('should execute the move command and update history for a final room', async () => {
    const command = new MoveCommand();
    const response = {
      data: {
        message: 'You won!',
        score: 100,
      },
    };
    api.move.mockResolvedValue(response);

    const addHistory = vi.fn();
    const result = await command.execute('north');
    command.updateHistory(result, addHistory);

    expect(api.move).toHaveBeenCalledWith('north');
    expect(addHistory).toHaveBeenCalledWith('You won!');
    expect(addHistory).toHaveBeenCalledWith('Score: 100');
  });

  it('should provide suggestions', () => {
    const command = new MoveCommand();
    const room = {
      exits: ['north', 'south'],
    };

    const suggestions = command.getSuggestions('n', room, []);
    expect(suggestions).toEqual(['north']);
  });
});
