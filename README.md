# Sturgeon Excursions
##  ~1,200 LOC of source code

A modern fishing charter booking website for Sturgeon Excursions. Built with React and ASP.NET Core, featuring a customer-facing booking system with real-time availability and charter management.

## Features
- **Charter Booking**: Book fishing excursions with date selection and package options
- **About Us**: Company information and fishing expertise showcase
- **Customer Management**: Track customer bookings and contact information
- **Real-time Availability**: Live availability checking for charter dates
- **Modern UI**: Responsive design with gradient aesthetics and smooth interactions
- **RESTful API**: Clean backend with Swagger documentation

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
mvp-service-business/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── apis/          # API service layer
│   │   ├── App.jsx        # Main app with tab navigation
│   │   ├── Home.jsx       # Landing page component
│   │   ├── BookNow.jsx    # Charter booking form
│   │   ├── AboutUs.jsx    # Company information page
│   │   └── index.jsx      # App entry point
│   └── package.json
├── server/                 # ASP.NET Core backend
│   ├── dtos/              # Data transfer objects
│   │   ├── Customer.cs    # Customer model
│   │   ├── CustomerDto.cs # Customer DTO
│   │   ├── Job.cs         # Job/Charter model
│   │   ├── JobDto.cs      # Job DTO
│   │   └── Invoice.cs     # Invoice model
│   ├── migrations/        # Database migrations
│   ├── Program.cs         # API endpoints and configuration
│   └── server.csproj
├── database-schema.sql    # PostgreSQL schema
├── QUICKSTART.md          # Quick setup guide
└── spending-dashboard.sln # Solution file
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
git clone https://github.com/yourusername/mvp-service-business.git
cd mvp-service-business
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
5. Explore the application:
   - **Home**: View the Sturgeon Excursions landing page with featured packages
   - **Book Now**: Select dates, choose packages, and book fishing charters
   - **About Us**: Learn about the company and fishing expertise

## Future Enhancements

- User authentication and customer accounts
- Email/SMS booking confirmations and reminders
- Online payment processing (Stripe/PayPal integration)
- Weather API integration for charter planning
- Photo gallery from past excursions
- Customer reviews and testimonials
- Mobile app for on-the-go bookings
- Multi-day trip packages and pricing tiers
- Gift certificate purchases
- Fishing license information and resources
- Real-time boat location tracking
- Catch photo upload and sharing
