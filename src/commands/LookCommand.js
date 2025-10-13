import Command from './Command';
import * as api from '../api/ApiService';

class LookCommand extends Command {
  constructor() {
    super('look', 'Look around the room.');
  }

  async execute(args) {
    return await api.look();
  }

  updateHistory(response, addHistory) {
    addHistory(`Room: ${response.data.name}`);
    addHistory(response.data.description);
  }
}

export default LookCommand;
