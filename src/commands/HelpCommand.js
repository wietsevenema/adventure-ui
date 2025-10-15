import Command from './Command';

class HelpCommand extends Command {
  constructor() {
    super('help', 'Shows a list of available commands.');
    this.needsRefresh = false;
  }

  async execute(args) {
    return Promise.resolve();
  }

  updateHistory(response, addHistory) {
    addHistory('Available commands: look, examine [thing], move [exit], take [item], help');
  }
}

export default HelpCommand;
