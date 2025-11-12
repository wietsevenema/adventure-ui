import Command from './Command';
import * as api from '../api/ApiService';

class InventoryCommand extends Command {
  constructor() {
    super('inventory', 'Check your inventory.', ['i', 'bag', 'items']);
  }

  async execute(args) {
    return await api.inventory();
  }

  updateHistory(response, addHistory) {
    addHistory(`Inventory: ${response.data.inventory.join(', ') || 'empty'}`);
  }
}

export default InventoryCommand;
