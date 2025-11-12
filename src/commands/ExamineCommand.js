import Command from './Command';
import * as api from '../api/ApiService';

class ExamineCommand extends Command {
  constructor() {
    super('examine', 'Examine an item or feature.', ['x', 'inspect', 'check']);
  }

  async execute(args) {
    return await api.examine(args);
  }

  updateHistory(response, addHistory) {
    addHistory(response.data.description);
  }
}

export default ExamineCommand;
