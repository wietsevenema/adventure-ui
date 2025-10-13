import Command from './Command';
import * as api from '../api/ApiService';

class ExamineCommand extends Command {
  constructor() {
    super('examine', 'Examine an item or feature.');
  }

  async execute(args) {
    return await api.examine(args);
  }

  updateHistory(response, addHistory) {
    addHistory(response.data.description);
  }

  getSuggestions(args, room, inventory) {
    const allItemsAndExits = [...(room?.items || []), ...inventory, ...(room?.exits || [])];
    return allItemsAndExits.filter(i => i.startsWith(args));
  }
}

export default ExamineCommand;
