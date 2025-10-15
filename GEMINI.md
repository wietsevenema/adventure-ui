
# Adventure UI

This project is a web-based user interface for a text-based adventure game. It provides a terminal-like interface for players to interact with the game world.

## Technologies

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [styled-components](https://styled-components.com/)
- **API Communication**: [axios](https://axios-http.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Linting**: [ESLint](https://eslint.org/)

## Project Structure

- `src/`: Contains the main source code for the application.
- `src/App.jsx`: The main application component.
- `src/main.jsx`: The entry point of the application.
- `src/components/`: Contains the React components.
- `src/components/Terminal.jsx`: The core UI component that simulates a terminal.
- `src/commands/`: Contains the implementation of the different commands that the player can use.
- `src/api/`: Contains the API service to communicate with the game server.
- `spec/`: Contains the OpenAPI specification for the game API.

## Building and Running

To get the project up and running, follow these steps:

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Run the development server**:

    ```bash
    npm run dev
    ```

3.  **Build for production**:

    ```bash
    npm run build
    ```

4.  **Run tests**:

    ```bash
    npm run test
    ```

    This will run the tests in non-interactive mode.

## Development Conventions

- The project uses a command pattern to handle player input. Each command is implemented as a class that extends the `Command` base class.
- The UI is built with React and styled-components.
- The application communicates with a backend server to manage the game state. The API is defined in the `spec/openapi.json` file.
- The project uses ESLint to enforce code quality.
