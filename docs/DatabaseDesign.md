# Database Design

This document showcases the Entity-Relationship Diagrams (ERDs) for the ShareMyRide platform. Each service owns its database, enforcing service isolation — no inter-service database joins.

---

## Master ERD

A unified view of all entities across the platform and their relationships.

![Master ERD](./diagrams/Master%20ERD.svg)

---

## User Service — MongoDB

Manages user accounts, authentication records, driver/vehicle records, and application workflows.

**Collections**: User, DriverRecord, VehicleRecord, VehicleList, Application

![User Service ERD](./diagrams/User%20Serviice%20ERD.svg)

---

## Trip Service — PostgreSQL (Prisma)

Manages the trip lifecycle including trips, bookings, drivers, passengers, vehicles, places, and pricing rules.

**Tables**: Trip, TripPlaces, Bookings, Driver, Passenger, Vehicle, VehicleList, Places, PricingRules

![Trip Service ERD](./diagrams/Trip%20Service%20ERD.svg)

---

## Payment Service — MongoDB

Manages payment processing, wallets, and transaction records.

**Collections**: BookingPayment, Customer, Transaction, Wallet, WalletTransaction

![Payment Service ERD](./diagrams/Payment%20Service%20ERD.svg)

---

## Realtime Service — MongoDB

Manages chat rooms, messages, members, and call sessions.

**Collections**: Chat, Message, Member, CallSession

![Realtime Service ERD](./diagrams/Realtime%20Service%20ERD.svg)

---

## Payment SAGA

The choreography-based saga flow for booking payments, showing the event-driven coordination between the Trip Service and Payment Service.

![Payment SAGA](./diagrams/Payment%20SAGA.svg)
