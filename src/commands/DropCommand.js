import Command from './Command';
import * as api from '../api/ApiService';

class DropCommand extends Command {
  constructor() {
    super('drop', 'Drop an item from your inventory.');
  }

  async execute(args) {
    return await api.drop(args);
  }

  updateHistory(response, addHistory) {
    addHistory(response.data.message);
  }
}

export default DropCommand;
