import Command from './Command';

class QuitCommand extends Command {
  constructor() {
    super('quit', 'Quit the current level and return to level select.', ['q', 'exit', ':q!']);
  }

  async execute(args) {
    // Mimic the API response structure for level completion
    return Promise.resolve({ data: { level_complete: true } });
  }

  updateHistory(response, addHistory) {
    addHistory('Quitting level...');
  }
}

export default QuitCommand;
