# Adventure UI

This project is a web-based user interface for [The Temple of the Forgotten Prompt](https://adventure.wietsevenema.eu/), an interactive text-based adventure game designed for both humans and AI agents. 

In The Temple of the Forgotten Prompt, you'll navigate ancient ruins, uncover secrets, and manipulate your environment to progress. You'll need to pay close attention to the descriptions to find clues, collect items, and figure out how to use them to overcome obstacles. 

This UI provides a terminal-like interface for players to interact with the game world.

## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) installed on your system.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wietsevenema/adventure-ui.git
   ```

2. Navigate to the project directory:

   ```bash
   cd adventure-ui/web
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Configuration

To run the application, you need to set the `API_KEY` environment variable. You can get an API key from [https://adventure.wietsevenema.eu/game-api](https://adventure.wietsevenema.eu/game-api).

Create a `.env` file in the `web` directory and add the following line:

```
API_KEY=your-api-key
```

Replace `your-api-key` with the API key you obtained.

## Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

This will start the development server and open the application in your default browser.