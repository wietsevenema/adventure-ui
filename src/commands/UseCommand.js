import Command from './Command';
import * as api from '../api/ApiService';

class UseCommand extends Command {
  constructor() {
    super('use', 'Use an item on something.');
  }

  async execute(args) {
    const [direct, indirect] = args.split(' on ');
    return await api.use(direct, indirect);
  }

  updateHistory(response, addHistory) {
    addHistory(response.data.message);
  }

  getSuggestions(args, room, inventory) {
    const parts = args.split(' on ');
    const allItems = [...(room?.items || []), ...inventory];
    const allItemsAndExits = [...allItems, ...(room?.exits || [])];

    if (parts.length === 1) {
      return allItemsAndExits.filter(i => i.startsWith(parts[0]));
    } else if (parts.length === 2) {
      const firstArg = parts[0];
      const potentialSecondArgs = allItemsAndExits.filter(i => i !== firstArg);
      return potentialSecondArgs.filter(i => i.startsWith(parts[1]));
    }
    return [];
  }
}

export default UseCommand;
