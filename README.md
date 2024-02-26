# Stock Trading Application

## Overview
The Stock Trading Application is a web-based platform that allows users to buy and sell stocks. It provides various features such as viewing real-time stock prices, managing user accounts, performing stock transactions, and more. This application aims to provide a user-friendly interface for users to engage in stock trading activities.

## Features
- **User Authentication**: Users can sign up, log in, and log out securely.
- **View Stock Prices**: Users can view real-time stock prices for different symbols.
- **Buy and Sell Stocks**: Users can buy and sell stocks based on the current market prices.
- **Manage User Profile**: Users can manage their profile information and view their transaction history.
- **Security**: The application ensures the security of user data and transactions through encryption and authentication mechanisms.
- **Responsive Design**: The application is responsive and optimized for various devices, including desktops, tablets, and mobile phones.

## Technologies Used
- **Frontend**: Angular framework is used for building the frontend interface of the application. It provides a dynamic and interactive user experience.
- **Backend**: Node.js with Express.js framework is used for building the backend server. It handles user authentication, stock transactions, and other server-side logic.
- **Database**: MongoDB is used as the database to store user accounts, stock information, and transaction history.
- **Authentication**: JSON Web Tokens (JWT) are used for user authentication and session management.
- **External APIs**: The application integrates with external APIs to fetch real-time stock prices and market data.

## Installation
1. **Clone the Repository**: 
    ```bash
    git clone https://github.com/your-username/stock-trading-app.git
    ```
2. **Install Dependencies**: 
    ```bash
    cd stock-trading-app
    npm install
    ```
3. **Set Up Environment Variables**: 
    Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=3000
    DB_URI=mongodb://localhost/stock_trading_app
    JWT_SECRET=your_jwt_secret
    EXTERNAL_API_KEY=your_external_api_key
    ```
4. **Start the Server**: 
    ```bash
    npm start
    ```

## Usage
1. **Signup/Login**: 
    - Visit the application URL and sign up for a new account or log in with existing credentials.
2. **View Stock Prices**: 
    - Navigate to the dashboard to view real-time stock prices and market trends.
3. **Buy and Sell Stocks**: 
    - Go to the trading page, enter the stock symbol and quantity, and click on the buy or sell button to execute a stock transaction.
4. **Manage Profile**: 
    - Update your profile information, change password, and view transaction history in the profile section.

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or support, please contact [Cole Baxendale](thecodercole@gmail.com).
