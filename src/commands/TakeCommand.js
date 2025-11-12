import Command from './Command';
import * as api from '../api/ApiService';

class TakeCommand extends Command {
  constructor() {
    super('take', 'Take an item.');
  }

  async execute(args) {
    return await api.take(args);
  }

  updateHistory(response, addHistory) {
    addHistory(response.data.message);
  }
}

export default TakeCommand;
