# Service Business Manager

A lightweight web application for automating traditional service industries (lawn care, plumbing, HVAC, electrical, etc.). Built with React and ASP.NET Core in under 1000 lines of code.

## Features

- **Customer Management**: Track customer information, contact details, and service history
- **Job Tracking**: Schedule and manage service jobs with status tracking
- **Invoice Generation**: Automatically create invoices from completed jobs
- **Multi-Industry Support**: Works for any service-based business
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
│   │   ├── App.jsx        # Main app with tab navigation
│   │   ├── Customers.jsx  # Customer management component
│   │   ├── Jobs.jsx       # Job management component
│   │   └── Invoices.jsx   # Invoice management component
│   └── package.json
├── server/                 # ASP.NET Core backend
│   ├── dtos/              # Data transfer objects
│   │   ├── Customer.cs    # Customer model
│   │   ├── Job.cs         # Job model
│   │   └── Invoice.cs     # Invoice model
│   ├── Program.cs         # API endpoints and configuration
│   └── server.csproj
├── database-schema.sql    # PostgreSQL schema
└── spending-dashboard.sln  # Solution file
```

## API Endpoints

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Retrieve all customers |
| POST | `/customers` | Create a new customer |
| PUT | `/customers/{id}` | Update a customer |
| DELETE | `/customers/{id}` | Delete a customer |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | Retrieve all jobs |
| POST | `/jobs` | Create a new job |
| PUT | `/jobs/{id}` | Update a job |
| DELETE | `/jobs/{id}` | Delete a job |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | Retrieve all invoices |
| GET | `/invoices/{id}` | Get invoice details with jobs |
| POST | `/invoices` | Create invoice from jobs |
| PUT | `/invoices/{id}/status` | Update invoice status |

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
Create a PostgreSQL database and run the schema from `database-schema.sql`:

```bash
psql -U postgres -d your_database < database-schema.sql
```

Or manually create the tables (see database-schema.sql for the complete schema with sample data).

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
    "DefaultConnection": "Host=localhost;Database=service_business;Username=postgres;Password=yourpassword"
  }
}
```

### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost:5001`. Update the API base URL in `client/src/apis/api.js` if your backend runs on a different port.

## Usage

1. Start the PostgreSQL database
2. Run the backend server (see Backend Setup)
3. Run the frontend application (see Frontend Setup)
4. Navigate to `http://localhost:3000` in your browser
5. Use the three tabs to manage:
   - **Customers**: Add service business customers
   - **Jobs**: Schedule and track service jobs
   - **Invoices**: Create invoices from completed jobs and track payment status

## Future Enhancements

- User authentication for multi-user access
- SMS/Email notifications for job scheduling
- Payment processing integration
- Mobile app for field workers
- GPS tracking for service locations
- Photo uploads for job documentation
- Recurring service scheduling
- Analytics dashboard with revenue tracking
- PDF invoice export and email delivery
- Customer portal for viewing invoices
