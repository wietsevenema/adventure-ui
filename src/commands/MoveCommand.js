import Command from './Command';
import * as api from '../api/ApiService';

class MoveCommand extends Command {
  constructor() {
    super('move', 'Move to a new location.');
  }

  async execute(args) {
    return await api.move(args);
  }

  updateHistory(response, addHistory) {
    if (response.data.score) {
      addHistory(response.data.message);
      addHistory(`Score: ${response.data.score}`);
    } else {
      addHistory(`Room: ${response.data.name}`);
      addHistory(response.data.description);
    }
  }

  getSuggestions(args, room, inventory) {
    return (room?.exits || []).filter(e => e.startsWith(args));
  }
}

export default MoveCommand;
