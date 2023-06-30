
# My Node.js CLI and Server Application

This project consists of a Node.js CLI (command-line interface) and a server application. The CLI allows you to interact with the server by executing HTTP methods through command-line commands.

## Prerequisites

- Node.js (version 18.X.X or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   git clone https://github.com/saima-khan1/foocoding-nodejs.git

2. Navigate to the project directory:

    cd foocoding-nodejs

3. install dependencies
    npm install

## Starting the Server
1. Open a terminal and navigate to the project directory.

2. Start the server:
    npm start run
The server will start running on http://localhost:3000.

Note: Keep the terminal running to keep the server running.

# Using the CLI
1. Open a new terminal (separate from the one running the server) and navigate to the project directory.

2. Run CLI commands using the following format:
    node cli.js [options]
Replace [options] with the desired CLI options and arguments.

Examples:

- Retrieve all users:
    node cli.js --resource users --method GET --all
- Retrieve a specific user by ID:
    node cli.js --resource users --method GET --id 1
- Add a new user:
    node cli.js --resource users --method POST
- Delete a user by ID:
    node cli.js --resource users --method DELETE --id 1
- Update a user by ID:
    node cli.js --resource users --method PATCH --id 1

3. Follow the prompts or provide the necessary input based on the command you executed.
Note: Make sure the server is running while using the CLI to interact with the server.

