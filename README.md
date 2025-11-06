# Spending Dashboard

A full-stack expense tracking application built with React and ASP.NET Core that enables users to manage and monitor their spending habits.

## Features

- **Create Expenses**: Add new expenses with amount, category, date, and notes
- **View Expenses**: Display all expenses in an organized list
- **Update Expenses**: Edit existing expense entries
- **Delete Expenses**: Remove unwanted expense records
- **RESTful API**: Clean, documented API endpoints with Swagger integration

## Tech Stack

### Frontend
- **React 19.1.0**: Modern UI library for building interactive interfaces
- **React Scripts**: Development tooling and build system
- **JavaScript (JSX)**: Component-based architecture

### Backend
- **ASP.NET Core 9.0**: High-performance web framework
- **Minimal API**: Lightweight, efficient endpoint routing
- **C#**: Type-safe backend logic
- **Swagger/OpenAPI**: Interactive API documentation

### Database
- **PostgreSQL**: Robust relational database
- **Npgsql**: .NET PostgreSQL driver

## Project Structure

```
spending-dashboard/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── apis/          # API service layer
│   │   ├── App.jsx        # Main application component
│   │   ├── ExpenseForm.jsx    # Form for creating/editing expenses
│   │   ├── ExpenseList.jsx    # List component for displaying expenses
│   │   └── Header.jsx     # Header component
│   └── package.json
├── server/                 # ASP.NET Core backend
│   ├── dtos/              # Data transfer objects
│   │   ├── Expense.cs     # Expense model with ID
│   │   └── ExpenseDto.cs  # Expense DTO for API requests
│   ├── Program.cs         # API endpoints and configuration
│   └── server.csproj
└── spending-dashboard.sln  # Solution file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expense` | Retrieve all expenses |
| POST | `/expense` | Create a new expense |
| PUT | `/expense/{id}` | Update an existing expense |
| DELETE | `/expense/{id}` | Delete an expense |

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [.NET SDK 9.0](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/download/)

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/spending-dashboard.git
cd spending-dashboard
```

### 2. Database Setup
Create a PostgreSQL database and run the following SQL to create the expenses table:

```sql
CREATE TABLE Expenses (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    notes TEXT
);
```

### 3. Backend Setup
```bash
cd server

# Update the connection string in appsettings.json
# Example:
# "ConnectionStrings": {
#   "DefaultConnection": "Host=localhost;Database=your_db;Username=your_user;Password=your_password"
# }

# Restore dependencies and run
dotnet restore
dotnet run
```

The API will start at `https://localhost:5001` (or similar). Swagger documentation will be available at `https://localhost:5001/swagger`.

### 4. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

The React app will open at `http://localhost:3000`.

## Configuration

### Backend Configuration
Update `server/appsettings.json` with your PostgreSQL connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=spending_db;Username=postgres;Password=yourpassword"
  }
}
```

### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost:5001`. Update the API base URL in `client/src/apis/expenseApi.js` if your backend runs on a different port.

## Usage

1. Start the PostgreSQL database
2. Run the backend server (see Backend Setup)
3. Run the frontend application (see Frontend Setup)
4. Navigate to `http://localhost:3000` in your browser
5. Add, view, edit, or delete expenses through the interface

## Development

### Running Tests
```bash
# Frontend tests
cd client
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
dotnet publish -c Release
```

## Future Enhancements

- User authentication and authorization
- Expense categories with custom icons
- Budget tracking and alerts
- Data visualization with charts and graphs
- Export expenses to CSV/PDF
- Date range filtering
- Search and filter functionality
- Mobile responsive design improvements

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Luke Schneider - [GitHub](https://github.com/yourusername)

---

Built with React, ASP.NET Core, and PostgreSQL
