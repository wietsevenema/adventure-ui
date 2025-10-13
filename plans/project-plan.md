# Project Plan: Adventure UI

## Goal

To provide a single, comprehensive document that captures the vision, goals,
user experience, and technical plan for the project. This document should be
clear enough for a new team member to understand the project's purpose and
direction.

---

## Part 1: The Vision (The "What" and "Why")

### 1.1. Problem & Vision Statement

*   **What is the problem we are solving?**
    *   There is a text-based adventure game API ("The Temple of the Forgotten Prompt") but no user-friendly web interface for players to interact with the game.
*   **Who are we solving it for?**
    *   Developers, students, or puzzle enthusiasts who enjoy a challenge and are comfortable with a command-line interface.
*   **What is our proposed solution?**
    *   A single-page web application that presents a terminal-like interface. Users will type commands (assisted by autocomplete) which are sent to the backend API, with the results displayed in the terminal output.
*   **What is the high-level goal?**
    *   To create a web-based, terminal-style UI for the adventure game "The Temple of the Forgotten Prompt," complete with command auto-completion to provide a seamless and intuitive player experience.

### 1.2. User Personas & Journeys

*   **User Journey(s):**
    *   **The Player's First Game:** A new player arrives at the web application. The app prompts them to enter their API key to begin. Once authenticated, the terminal displays the starting room's description. The player uses commands (assisted by autocomplete) like `look`, `move <exit>`, and `take <item>` to interact with the game. The terminal updates with the results of their actions, describing new rooms, items, and events. This continues until the player solves the final puzzle and the game ends, displaying their score.

### 1.3. High-Level Visual Concepts

*   **Color Palette:** Green text on a black background.
*   **Typography:** "Roboto Mono" (monospaced).
*   **Inspirational Websites/Apps:** Classic computer terminals.
*   **Key Screen Layouts:** A single-screen layout. The top portion of the screen is the game's text output area. The bottom portion contains the command input prompt.

### 1.5. Out of Scope

*   A graphical interface (e.g., clickable maps, drag-and-drop inventory).
*   Real-time multiplayer functionality.
*   A tool for creating or editing game content.

---

## Part 2: The Execution (The "How")

### 2.1. System Architecture

*   A single-page web application, built with a modern frontend framework (React). It will communicate with the existing "Temple of the Forgotten Prompt" REST API via authenticated HTTP requests to manage game state.

### 2.2. Key Technology Choices

*   **Framework:** React
*   **Build Tool:** Vite
*   **API Communication:** axios
*   **Styling:** styled-components

### 2.3. Modules

*A breakdown of the major functional areas and components of the application.*

*   **`ApiService`:** A dedicated module to handle all `axios` communication with the backend game API.
*   **`Terminal`:** The core UI component that manages the layout, state, and holds the other components together.
*   **`History`:** A component within the `Terminal` that displays the log of past commands and game responses.
*   **`Input`:** The command input component, which will manage user input and incorporate the autocomplete logic.
