import Command from './Command';
import * as api from '../api/ApiService';
import { formatRoomOutput } from '../utils/formatting';

class LookCommand extends Command {
  constructor() {
    super('look', 'Look around the room.');
  }

  async execute(args) {
    return await api.look();
  }

  updateHistory(response, addHistory) {
    const lines = formatRoomOutput(response.data.name, response.data.description);
    lines.forEach(line => addHistory(line));
  }
}

export default LookCommand;
