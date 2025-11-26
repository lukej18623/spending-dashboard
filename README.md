# Sturgeon Excursions

A modern fishing charter booking website for Sturgeon Excursions. Built with React and ASP.NET Core, featuring a customer-facing booking system with real-time availability and charter management.

## Features
- **Excursion Booking System**: Book fishing charters with date selection, time slot selection (morning/afternoon/full-day), and guest count
- **Real-time Availability**: Live availability calendar showing open dates and time slots for each excursion type
- **Blocked Date Management**: Admin capability to block dates for maintenance or weather
- **Customer Management**: Track customer information and booking history
- **Capacity Validation**: Automatic enforcement of maximum guest capacity per excursion
- **Booking Conflict Prevention**: Database-level constraints prevent double-booking
- **Modern UI**: Clean, responsive design with blue/gold color scheme and smooth interactions
- **RESTful API**: Well-structured backend with Swagger documentation

## Tech Stack

### Frontend
- **React 18.3.1**: Modern UI library for building interactive interfaces
- **React Calendar**: Date selection component for booking interface
- **React Scripts 5.0.1**: Development tooling and build system
- **JavaScript (JSX)**: Component-based architecture

### Backend
- **ASP.NET Core 8.0**: High-performance web framework
- **Minimal API**: Lightweight, efficient endpoint routing
- **C#**: Type-safe backend logic
- **Swagger/OpenAPI**: Interactive API documentation

### Database
- **PostgreSQL**: Robust relational database with advanced features
- **Npgsql 9.0.3**: .NET PostgreSQL driver
- **Database Views**: Pre-computed availability calendar
- **Stored Functions**: Business logic for availability checking and capacity validation

## Project Structure

```
sturgeon-excursions/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── App.jsx            # Main app with tab navigation
│   │   ├── Home.jsx           # Landing page component
│   │   ├── BookNow.jsx        # Charter booking form
│   │   ├── AboutUs.jsx        # Company information page
│   │   ├── PhotoGallery.jsx   # Photo gallery component
│   │   ├── CalendarPicker.jsx # Calendar selection component
│   │   ├── index.jsx          # App entry point
│   │   └── index.css          # Global styles
│   └── package.json
├── server/                     # ASP.NET Core backend
│   ├── dtos/                  # Data transfer objects
│   │   ├── Excursion.cs       # Excursion model
│   │   ├── Customer.cs        # Customer model
│   │   ├── CustomerDto.cs     # Customer DTO
│   │   ├── Booking.cs         # Booking model
│   │   ├── BookingDto.cs      # Booking DTO
│   │   ├── BookingResponse.cs # Booking response model
│   │   ├── BookingStatusUpdate.cs
│   │   ├── BlockedDate.cs     # Blocked date model
│   │   ├── BlockedDateDto.cs  # Blocked date DTO
│   │   └── AvailabilityResponse.cs
│   ├── migrations/            # Database migrations
│   ├── Program.cs            # API endpoints and configuration (453 lines)
│   ├── server.csproj         # Project configuration
│   └── appsettings.json      # Configuration settings
├── database-schema.sql        # PostgreSQL schema (256 lines)
├── QUICKSTART.md             # Quick setup guide
└── spending-dashboard.sln    # Solution file
```

## Database Schema

### Tables
- **Excursions**: Trip templates (Half-Day Morning, Half-Day Afternoon, Full-Day Trophy Hunt)
- **Customers**: Customer contact information
- **Bookings**: Booking records with date, time slot, guest count, and status
- **BlockedDates**: Dates that are unavailable for booking

### Business Rules (enforced at database level)
- Prevent double-booking (unique constraint on excursion/date/time)
- Prevent booking in the past
- Validate guest count (1-10 guests, must not exceed excursion capacity)
- Valid status values: confirmed, completed, cancelled, no-show

## API Endpoints

### Excursions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/excursions` | Retrieve all active excursions |
| GET | `/excursions/{id}` | Get specific excursion details |
| GET | `/excursions/{id}/availability` | Get availability for excursion (90 days) |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Retrieve all customers |
| POST | `/customers` | Create a new customer |
| PUT | `/customers/{id}` | Update a customer |
| DELETE | `/customers/{id}` | Delete a customer |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | Retrieve all bookings |
| GET | `/bookings/{id}` | Get specific booking details |
| POST | `/bookings` | Create a new booking (with validation) |
| PATCH | `/bookings/{id}/status` | Update booking status |
| DELETE | `/bookings/{id}` | Delete a booking |

### Blocked Dates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blocked-dates` | Retrieve all blocked dates |
| POST | `/blocked-dates` | Block a date |
| DELETE | `/blocked-dates/{id}` | Remove a blocked date |

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [.NET SDK 8.0](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/download/) (v12 or higher)

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/sturgeon-excursions.git
cd sturgeon-excursions
```

### 2. Database Setup
Create a PostgreSQL database and run the schema:

```bash
# Create database
createdb service_business

# Import schema with sample data
psql -d service_business -f database-schema.sql
```

The schema includes:
- 3 sample excursions (Half-Day Morning, Half-Day Afternoon, Full-Day Trophy Hunt)
- Sample blocked dates (Christmas, New Year's)
- Database functions for availability checking and capacity validation
- Pre-computed availability view for the next 90 days

### 3. Backend Setup
```bash
cd server

# Update the connection string in appsettings.json
# IMPORTANT: Do not commit passwords to version control
nano appsettings.json

# Example configuration:
# {
#   "ConnectionStrings": {
#     "DefaultConnection": "Host=localhost;Database=service_business;Username=postgres;Password=yourpassword"
#   }
# }

# Restore dependencies and run
dotnet restore
dotnet run
```

The API will start at `http://localhost:5001` (or `https://localhost:5001` in production mode). Swagger documentation is available at `http://localhost:5001/swagger`.

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
Edit `server/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=service_business;Username=postgres;Password=yourpassword"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**Security Note**: Never commit real passwords to version control. Use environment variables or Azure Key Vault in production.

### Frontend Configuration
The frontend connects to the backend at `http://localhost:5001`. If your backend runs on a different port, update the API base URL in the API service files.

### CORS Configuration
CORS is configured in `server/Program.cs` to allow requests from `http://localhost:3000` and `http://localhost:3001`. Modify this for production deployments.

## Usage

1. **Start PostgreSQL**: Ensure your PostgreSQL server is running
2. **Start Backend**: Run `dotnet run` from the `server` directory
3. **Start Frontend**: Run `npm start` from the `client` directory
4. **Access Application**: Navigate to `http://localhost:3000`

### Using the Application

**Home Tab**: View the Sturgeon Excursions landing page with featured packages and special offers (50% off first excursion)

**Book Now Tab**:
- Select an excursion type (Half-Day Morning/Afternoon or Full-Day Trophy Hunt)
- Choose a date using the calendar
- Pick a time slot (morning/afternoon/full-day)
- Enter number of guests
- Provide customer contact information
- Add special requests (optional)
- Submit booking

**About Us Tab**: Learn about Sturgeon Excursions, the guides, and fishing expertise

## Key Features Explained

### Real-time Availability
The system uses a PostgreSQL view (`AvailableDates`) that generates a 90-day availability calendar by:
- Cross-joining excursions with date ranges
- Left-joining with bookings to find conflicts
- Filtering out blocked dates
- Returning morning/afternoon/full-day availability flags

### Booking Validation
Before creating a booking, the system:
1. Checks if the date/time is available (not already booked or blocked)
2. Validates guest count against excursion capacity
3. Prevents double-booking with database unique constraints
4. Enforces business rules (no past bookings, valid status values)

### Database Functions
- `check_availability(excursion_id, booking_date, time_slot)`: Returns true if date/time is available
- `validate_booking_capacity(excursion_id, num_guests)`: Returns true if guest count is within capacity

## Troubleshooting

**Backend won't start?**
- Check PostgreSQL is running: `pg_isready`
- Verify connection string in `server/appsettings.json`
- Check .NET SDK version: `dotnet --version` (need 8.0+)

**Frontend won't connect?**
- Verify backend is running at `http://localhost:5001`
- Check browser console for CORS errors
- Ensure CORS policy in `server/Program.cs` includes your frontend URL

**Database errors?**
- Verify database exists: `psql -l | grep service_business`
- Check tables are created: `psql -d service_business -c "\dt"`
- Verify functions exist: `psql -d service_business -c "\df"`

**Booking creation fails?**
- Check if date is already booked or blocked
- Verify guest count doesn't exceed excursion capacity
- Ensure date is not in the past
- Check database constraints are properly created

## Future Enhancements

- **Payment Processing**: Stripe/PayPal integration for online payments
- **User Authentication**: Customer accounts with booking history
- **Email Notifications**: Automated booking confirmations and reminders
- **SMS Integration**: Text message confirmations via Twilio
- **Weather API**: Display weather forecast for booked dates
- **Admin Dashboard**: Booking management interface for staff
- **Photo Upload**: Allow customers to upload catch photos
- **Reviews & Ratings**: Customer testimonials and trip ratings
- **Multi-language Support**: Spanish and other languages
- **Mobile App**: React Native app for iOS/Android
- **Calendar Export**: iCal/Google Calendar integration
- **Gift Certificates**: Purchase and redeem gift certificates
- **Dynamic Pricing**: Seasonal pricing and discounts
- **Fishing Reports**: Recent catches and water conditions
- **Equipment Rental**: Add equipment rental options to bookings
- **Group Discounts**: Automatic pricing for large groups
