import { describe, it, expect, vi } from 'vitest';
import HelpCommand from '../commands/HelpCommand';

describe('HelpCommand', () => {
  it('should update history with the help message', () => {
    const command = new HelpCommand();
    const addHistory = vi.fn();
    command.updateHistory(null, addHistory);

    expect(addHistory).toHaveBeenCalledWith('Available commands:');
    expect(addHistory).toHaveBeenCalledWith('  look (l, ls, view, see) - Look around in the room.');
    expect(addHistory).toHaveBeenCalledWith('  inventory (i, bag, items) - List your inventory.');
    expect(addHistory).toHaveBeenCalledWith('  examine <thing> (x, inspect, check) - Describe an item or exit.');
    expect(addHistory).toHaveBeenCalledWith('  move <exit> (m, go, cd, walk) - Move through an exit.');
    expect(addHistory).toHaveBeenCalledWith('  take <item> (t, get, grab) - Take an item.');
    expect(addHistory).toHaveBeenCalledWith('  use <item> [on <target>] (u, apply) - Use an item, or an item on a target.');
    expect(addHistory).toHaveBeenCalledWith('  drop <item> (d, discard, release) - Drop an item from your inventory.');
    expect(addHistory).toHaveBeenCalledWith('  quit (q, exit, :q!) - Quit the level.');
    expect(addHistory).toHaveBeenCalledWith('  help (h, ?, man, info) - Show a list of commands.');
  });
});
