class Command {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.needsRefresh = true;
  }

  execute(args) {
    throw new Error('Not implemented');
  }

  getSuggestions(args, room, inventory) {
    return [];
  }

  updateHistory(response, addHistory) {
    addHistory(response);
  }
}

export default Command;
