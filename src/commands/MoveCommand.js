import Command from './Command';
import * as api from '../api/ApiService';
import { formatRoomOutput } from '../utils/formatting';

class MoveCommand extends Command {
  constructor() {
    super('move', 'Move to a new location.', ['m', 'go', 'cd', 'walk']);
  }

  async execute(args) {
    return await api.move(args);
  }

  updateHistory(response, addHistory) {
    if (response.data.score) {
      addHistory(response.data.message);
      addHistory(`Score: ${response.data.score}`);
    } else {
      const lines = formatRoomOutput(response.data.name, response.data.description);
      lines.forEach(line => addHistory(line));
    }
  }
}

export default MoveCommand;
