import Command from './Command';

class HelpCommand extends Command {
  constructor() {
    super('help', 'Shows a list of available commands.', ['h', '?', 'man', 'info']);
    this.needsRefresh = false;
  }

  async execute(args) {
    return Promise.resolve();
  }

  updateHistory(response, addHistory) {
    addHistory('Available commands:');
    addHistory('  look (l, ls, view, see) - Look around in the room.');
    addHistory('  inventory (i, bag, items) - List your inventory.');
    addHistory('  examine <thing> (x, inspect, check) - Describe an item or exit.');
    addHistory('  move <exit> (m, go, cd, walk) - Move through an exit.');
    addHistory('  take <item> (t, get, grab) - Take an item.');
    addHistory('  use <item> [on <target>] (u, apply) - Use an item, or an item on a target.');
    addHistory('  drop <item> (d, discard, release) - Drop an item from your inventory.');
    addHistory('  quit (q, exit, :q!) - Quit the level.');
    addHistory('  help (h, ?, man, info) - Show a list of commands.');
    addHistory('');
    addHistory('Keyboard shortcuts:');
    addHistory('  Ctrl+L - Clear screen');
    addHistory('  Ctrl+A - Start of line');
    addHistory('  Ctrl+E - End of line');
    addHistory('  Ctrl+K - Delete to end of line');
    addHistory('  Ctrl+U - Delete to start of line');
    addHistory('  Ctrl+P / Up - Previous command');
    addHistory('  Ctrl+N / Down - Next command');
  }
}

export default HelpCommand;
