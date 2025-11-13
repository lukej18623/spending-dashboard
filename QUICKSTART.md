# Quick Start Guide

Get the Service Business Manager running in 5 minutes!

## Step 1: Database Setup

```bash
# Create a PostgreSQL database
createdb service_business

# Import the schema with sample data
psql -d service_business -f database-schema.sql
```

## Step 2: Configure Backend

Edit `server/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=service_business;Username=postgres;Password=YOUR_PASSWORD"
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

## Step 3: Start Backend

```bash
cd server
dotnet restore
dotnet run
```

Backend will run at `http://localhost:5001`

## Step 4: Start Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

Frontend will open at `http://localhost:3000`

## Step 5: Try It Out!

The app comes with sample data:
- 3 customers (John Smith, Sarah Johnson, Mike Davis)
- 4 jobs (lawn care, plumbing, HVAC services)

Try these workflows:
1. **Add a new customer** in the Customers tab
2. **Create a job** for that customer in the Jobs tab
3. **Mark the job as "Completed"** by editing it
4. **Generate an invoice** in the Invoices tab by selecting the customer and completed jobs

## Troubleshooting

**Backend won't start?**
- Check PostgreSQL is running: `pg_isready`
- Verify connection string in appsettings.json
- Check .NET SDK version: `dotnet --version` (need 9.0+)

**Frontend won't connect?**
- Verify backend is running at http://localhost:5001
- Check browser console for errors
- Ensure CORS is enabled in Program.cs

**Database errors?**
- Run `psql -d service_business` and verify tables exist
- Check table names are capitalized correctly

## Line Count

This MVP contains approximately **810 lines of code**:
- Backend: 307 LOC (Program.cs + DTOs)
- Frontend: 503 LOC (React components + API)
