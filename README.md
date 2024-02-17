# Real Estate Trading System

This repository contains the backend implementation of a Real Estate Trading System. The system allows users to buy and sell shares of real estate properties. The code is written in JavaScript and uses Node.js along with MongoDB as the database.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Code Overview](#code-overview)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with this project, follow the instructions below.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hack-A-Week/Enigma-2024
2. Navigate to the folder:
    ```bash
   cd real-estate-trading-system
3. Install the dependencies:
   ```bash
   npm install
4. Export the link to MongoDB Cloud.
   ```bash
   module.exports = {
      mongoURI: 'your-mongodb-uri'
   };

5. Start the server
   ```bash
   npm start
The application should now be running on http://localhost:3000.

## Usage

- Access the API endpoints for buying and selling real estate shares.
- Ensure that the required parameters are provided for each endpoint.

## Features

- **Buy Shares:** Users can buy shares of real estate properties.
- **Sell Shares:** Users can sell their owned shares of real estate properties.
- **Pending Transactions:** The system handles pending transactions when there are matching buy and sell requests.

## Code Overview

The main functionality is implemented in `utils/updatedatabaseforselling.js`. This module contains functions for updating the database when selling real estate shares. Key functions include:

- `updateRealEstateForSelling`: Handles the selling process, updates user and pending selling data.
- `updatePendingSellingUser`: Updates pending selling user data.
- `retrievePendingUsers`: Retrieves pending buying users, matches with selling criteria, and executes transactions.
- `check`: Checks the relationship between the selling and buying prices.
- `recursion`: Handles the case where the selling price matches with multiple buying prices.

## Contributing

Contributions are welcome! Fork the repository, create a branch, make changes, and open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to customize this README to better fit your specific project details and needs.
