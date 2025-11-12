import Command from './Command';
import * as api from '../api/ApiService';

class UseCommand extends Command {
  constructor() {
    super('use', 'Use an item on something.', ['u', 'apply']);
  }

  async execute(args) {
    const [direct, indirect] = args.split(' on ');
    return await api.use(direct.trim(), indirect ? indirect.trim() : undefined);
  }

  updateHistory(response, addHistory) {
    addHistory(response.data.message);
  }
}

export default UseCommand;
