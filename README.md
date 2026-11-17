# Travel Booking Portal

A full-stack travel booking web application built with React, Spring Boot and MySQL. The product supports flight and hotel discovery, customer profiles, bookings for yourself or other travelers, simulated checkout and booking history.

## Technology

- **Frontend:** React 18, React Router, Axios
- **Backend:** Java, Spring Boot 3, Spring Data JPA, Spring Security password encoder
- **Database:** MySQL
- **API documentation:** Springdoc / Swagger UI

## Product workflows

### Flights
1. Search by origin, destination and departure date.
2. Choose the number of passengers.
3. Select an available flight.
4. Choose **Booking for me** or **Booking for others**.
5. Review passenger details. The first passenger is prefilled from the signed-in customer's profile when booking for yourself.
6. Add or remove additional passengers.
7. Continue to the simulated payment page and confirm the booking.

### Hotels
1. Search by destination, check-in/check-out dates, rooms, guests and optional filters.
2. Select a hotel.
3. Choose **Booking for me** or **Booking for others**.
4. Review guest details. The first guest is prefilled from the customer's profile when booking for yourself.
5. Add or remove guests and assign them to rooms.
6. Continue to simulated payment and confirm the stay.

### Payments
Payments are deliberately simulated. The checkout lets a user select UPI, card or net banking as a demo method; it does not collect card numbers, CVV, UPI PINs or bank credentials and does not contact a payment gateway. A successful demo payment changes the booking from `PENDING_PAYMENT` to `CONFIRMED`.

### Customer profile
The profile stores name, email, phone, date of birth, gender, profile image URL, hometown, address and optional travel preferences. Passenger and guest details are copied into the booking as booking-time snapshots, so later profile edits do not rewrite old reservations.

## Run locally

### Prerequisites
- Java 17 or newer
- MySQL 8
- Node.js and npm

### 1. Database
Start MySQL. The application uses a database named `app_db`; the configured JDBC URL creates it if it does not exist.

### 2. Backend
In PowerShell:

```powershell
cd springapp
$env:DB_URL = "jdbc:mysql://localhost:3306/app_db?createDatabaseIfNotExist=true"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "YOUR_LOCAL_MYSQL_PASSWORD"
mvn spring-boot:run
```

If Maven is not installed, run the Spring Boot application from IntelliJ IDEA using `TravelBookingPortalApplication` after setting the same environment variables in the run configuration.

Backend base URL: `http://localhost:8080`

Swagger UI (when the backend is running): `http://localhost:8080/swagger-ui/index.html`

### 3. Frontend
Open a second terminal:

```powershell
cd reactapp
npm install
npm start
```

Frontend: `http://localhost:8081`

The frontend API base URL is configured in `reactapp/src/utils/constants.js`.

## Important implementation notes

- Hibernate uses `ddl-auto=update` for local development so adding profile and booking fields does not recreate the schema on every startup. Back up your database before applying schema changes. Use versioned migrations (Flyway or Liquibase) before production deployment.
- Hotel date availability is calculated from overlapping confirmed bookings against the hotel's room inventory. The current model is a prototype inventory model, not a channel-manager integration.
- Inventory is checked and updated inside the simulated payment transaction. Booking and inventory rows are locked during payment confirmation to reduce double allocation.
- The project currently uses a demo authentication flow and does not yet have production-grade server-side session/JWT authorization. Frontend route guards are not a security boundary. Do not deploy with real customer data or public admin access.
- Admin seed accounts and sample flights/hotels are intended for local demonstration only.
- The project does not connect to real airlines, hotel providers, payment gateways, email services or refund systems.

## Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/bookings/flight/checkout` | Create pending flight booking with passengers |
| POST | `/api/bookings/hotel/checkout` | Create pending hotel booking with guests |
| POST | `/api/bookings/{id}/pay` | Simulate payment and confirm booking |
| GET | `/api/bookings/{id}` | Retrieve booking details |
| PUT | `/api/bookings/{id}/cancel` | Cancel a booking |
| GET | `/Auth/{userId}` | Retrieve customer profile |
| PUT | `/Auth/update/{userId}` | Update customer profile |

