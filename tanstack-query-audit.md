# TanStack Query Audit — smr-frontend

## QueryClient Config

**File:** `components/Provider/QueryProvider.tsx`

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000 * 60, // 5 minutes
    },
  },
})
```

No default `gcTime` override (TanStack default: 5 minutes). No default mutation options.

---

## All Queries

### Driver Domain

| File | Query Key | staleTime | gcTime |
|---|---|---|---|
| `features/driver/home/views/DriverHomeView.tsx:19` | `["driverTripStats"]` | 5m (default) | 5m (default) |
| `features/driver/home/views/DriverHomeView.tsx:24` | `["driverEarnings"]` | 5m (default) | 5m (default) |
| `features/driver/home/views/DriverHomeView.tsx:29` | `["driverTodayTrip"]` | 5m (default) | 5m (default) |
| `features/driver/home/views/DriverHomeView.tsx:34` | `["driverRecentBookings"]` | 5m (default) | 5m (default) |
| `features/driver/bookings/views/DriverBookingsView.tsx:23` | `["driverBookings", statusFilter, page, limit]` | 5m (default) | 5m (default) |
| `features/driver/bookings/views/DriverBookingDetailsView.tsx:44` | `["driverBookingDetails", bookingId]` | 5m (default) | 5m (default) |
| `features/driver/trips/views/DriverTripsView.tsx:34` | `["driverTrips", statusFilter, page, limit]` | 5m (default) | 5m (default) |
| `features/driver/trips/views/DriverTripDetailsView.tsx:45` | `["driverTripDetails", tripId]` | 5m (default) | 5m (default) |
| `features/driver/trips/forms/CreateTripForm.tsx:64` | `["driverVehicles"]` | 5m (default) | 5m (default) |
| `features/driver/journey/views/DiverJourneyView.tsx:31` | `["driverJourneyDetails", journeyId]` | 5m (default) | 5m (default) |

### Passenger Domain

| File | Query Key | staleTime | gcTime |
|---|---|---|---|
| `features/passenger/home/views/PassengerHomeView.tsx:18` | `["passengerBookingStats"]` | 5m (default) | 5m (default) |
| `features/passenger/home/views/PassengerHomeView.tsx:23` | `["passengerWalletBalance"]` | 5m (default) | 5m (default) |
| `features/passenger/home/views/PassengerHomeView.tsx:28` | `["passengerTodayTrip"]` | 5m (default) | 5m (default) |
| `features/passenger/home/views/PassengerHomeView.tsx:33` | `["passengerRecentBookings"]` | 5m (default) | 5m (default) |
| `features/passenger/bookings/views/PassengerBookingsView.tsx:25` | `["passengerBookings", statusFilter, page, limit]` | 5m (default) | 5m (default) |
| `features/passenger/bookings/views/PassengerBookingDetailsView.tsx:34` | `["passengerBookingDetails", bookingId]` | 5m (default) | 5m (default) |
| `features/passenger/journey/views/PassengerJourneyView.tsx:25` | `["passengerJourneyDetails", journeyId]` | 5m (default) | 5m (default) |

### Profile Domain

| File | Query Key | staleTime | gcTime |
|---|---|---|---|
| `components/PortalNavbar.tsx:38` | `["currentUser"]` | 5m (default) | 5m (default) |
| `app/profile/layout.tsx:22` | `["currentUser"]` | 5m (default) | 5m (default) |
| `features/chat/view/ChatView.tsx:29` | `["currentUser"]` | 5m (default) | 5m (default) |
| `features/profile/forms/ProfileUpdateForm.tsx:37` | `["userProfile"]` | **Infinity** | **Infinity** |
| `features/profile/components/ProfileDriverCard.tsx:15` | `["driverDetails"]` | 5m (default) | 5m (default) |
| `features/profile/components/ProfileVehiclesCard.tsx:15` | `["driverVehicles"]` | 5m (default) | 5m (default) |
| `features/profile/views/UserApplicationsView.tsx:20` | `["userApplications", searchQuery]` | 5m (default) | 5m (default) |
| `features/profile/views/UserApplicationDetailsView.tsx:27` | `["userApplicationDetails", applicationId]` | 5m (default) | 5m (default) |
| `features/profile/views/WalletTransactionsView.tsx:78` | `["walletTransactions", queryParams]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |

### Application Domain

| File | Query Key | staleTime | gcTime |
|---|---|---|---|
| `features/application/components/sections/VehicleFieldsSection.tsx:35` | `["predefinedVehiclesList"]` | 24 hours | 24 hours |

### Admin Domain

| File | Query Key | staleTime | gcTime |
|---|---|---|---|
| `features/admin/trips/views/AdminTripsView.tsx:62` | `["adminTrips", queryParams]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/trips/views/AdminTripDetailsView.tsx:17` | `["adminTripDetails", tripId]` | 5m (default) | 5m (default) |
| `features/admin/bookings/views/AdminBookingsView.tsx:62` | `["adminBookings", queryParams]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/bookings/views/AdminBookingDetailsView.tsx:17` | `["adminBookingDetails", bookingId]` | 5m (default) | 5m (default) |
| `features/admin/users/views/AdminUsersView.tsx:84` | `["allUsers", queryParams]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/users/components/user-details/ProfilDetailsCard.tsx:41` | `["userDetails", userId]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/users/components/user-details/DriverDetailsCard.tsx:13` | `["adminDriverDetails", userId]` | 5m (default) | 5m (default) |
| `features/admin/users/components/user-details/VehicleDetailsCard.tsx:13` | `["adminDriverVehicles", userId]` | 5m (default) | 5m (default) |
| `features/admin/vehicles/views/AdminVehiclesView.tsx:65` | `["adminVehicleRecords", queryParams]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/vehicles/views/AdminVehicleDetailsView.tsx:16` | `["adminVehicleRecordDetails", vehicleId]` | 5m (default) | 5m (default) |
| `features/admin/applications/views/AdminApplicationsView.tsx:67` | `["adminApplications", queryParams]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/applications/views/AdminApplicationDetailsView.tsx:30` | `["adminApplicationDetails", applicationId]` | 5m (default) | 5m (default) |
| `features/admin/transactions/views/AdminTransactionsView.tsx:77` | `["adminTransactions", queryParams]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/settings/views/AdminConfigView.tsx:11` | `["adminConfigurations"]` | prod: 60000ms / dev: 0 | 5m (default) |
| `features/admin/payouts/views/AdminPayoutsView.tsx:96` | `["allPayouts", queryParams, searchValue]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/payouts/views/AdminPayoutDetailsView.tsx:13` | `["payoutDetails", payoutId]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/payouts/components/payout-details/PayoutInfoCard.tsx:40` | `["payoutDetails", payoutId]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/payouts/components/payout-details/JourneyInfoCard.tsx:14` | `["adminJourneyDetails", journeyId]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/payouts/components/payout-details/TripInfoCard.tsx:13` | `["adminTripDetails", tripId]` | prod: 600ms / dev: 0 | prod: 600ms / dev: 0 |
| `features/admin/dashboard/components/ApplicationCountCard.tsx:9` | `["adminApplicationCount"]` | 5m (default) | 5m (default) |
| `features/admin/dashboard/components/UserCountCard.tsx:9` | `["adminUsersCount"]` | 5m (default) | 5m (default) |
| `features/admin/dashboard/components/TripsCountCard.tsx:9` | `["adminTripsCount"]` | 5m (default) | 5m (default) |
| `features/admin/dashboard/components/TransactionsCard.tsx:17` | `["adminTransactionsSummary"]` | 5m (default) | 5m (default) |
| `features/admin/dashboard/components/RevenueTrendGraph.tsx:35` | `["adminRevenueTrend", range]` | 5m (default) | 5m (default) |
| `features/admin/dashboard/components/TripTrendGraph.tsx:27` | `["adminTripTrend", range]` | 5m (default) | 5m (default) |
| `features/admin/dashboard/components/LatestTransactionsTable.tsx:61` | `["adminLatestTransactions"]` | 5m (default) | 5m (default) |
| `features/admin/dashboard/components/NewApplicationsTable.tsx:60` | `["adminLatestApplications"]` | 5m (default) | 5m (default) |

---

## All Mutations (with invalidation status)

| File | Mutation | Invalidates? | Keys Invalidated |
|---|---|---|---|
| `features/driver/bookings/views/DriverBookingDetailsView.tsx:224` | Accept booking | Yes | `["driverBookings"]` |
| `features/driver/bookings/views/DriverBookingDetailsView.tsx:242` | Reject booking | Yes | `["driverBookings"]` |
| `features/driver/trips/views/DriverTripDetailsView.tsx:259` | Cancel trip | Yes | `["driverTrips"]` |
| `features/driver/trips/forms/CreateTripForm.tsx:313` | Create trip | Yes | `["driverTrips"]`, `["userProfile"]` |
| `features/driver/journey/components/CurrentTargetCard.tsx:109` | verifyPickupMutation | Yes | `["driverJourneyDetails", journeyId]` |
| `features/driver/journey/components/CurrentTargetCard.tsx:137` | arrivedMutation | Yes | `["driverJourneyDetails", journeyId]` |
| `features/driver/journey/components/CurrentTargetCard.tsx:183` | dropOffMutation | Yes | `["driverJourneyDetails", journeyId]` |
| `features/driver/journey/components/CurrentTargetCard.tsx:228` | completeJourneyMutation | Yes | `["driverJourneyDetails", journeyId]` |
| `features/passenger/bookings/components/BookingDetailsActionCard.tsx:47` | Withdraw booking | Yes | `["passengerBookings"]` |
| `features/passenger/bookings/components/BookingDetailsActionCard.tsx:52` | Cancel booking | Yes | `["passengerBookings"]` |
| `features/passenger/bookings/components/OnlinePaymentButton.tsx:85` | Online payment success | Yes | `["passengerBookings"]`, `["passengerBookingDetails", bookingId]` |
| `features/passenger/bookings/components/OnlinePaymentButton.tsx:117` | Online payment failure | Yes | `["passengerBookings"]`, `["passengerBookingDetails", bookingId]` |
| `features/passenger/bookings/components/WalletPaymentButton.tsx:57` | Wallet payment | Yes | `["passengerBookings"]`, `["passengerBookingDetails", bookingId]` |
| `features/passenger/journey/components/PassengerDetailsCard.tsx:23` | confirmPickupMutation | Yes | `["passengerJourneyDetails", journeyId]` |
| `features/profile/components/ProfileUserCard.tsx:40` | Update profile | Yes | `["userProfile"]` |
| `features/profile/components/ProfileImageComponent.tsx:22` | uploadAvatarMutation | Yes | `["currentUser"]` |
| `features/profile/forms/ProfileUpdateForm.tsx:117` | Update profile | setQueryData | `["currentUser"]` (via setQueryData) |
| `features/admin/settings/components/AdminVehicleListTable.tsx:36` | Update vehicle config | Yes | `["adminConfigurations"]` |
| `features/admin/settings/components/AdminVehicleListTable.tsx:57` | Create vehicle config | Yes | `["adminConfigurations"]` |
| `features/admin/settings/components/AdminTripPricingCard.tsx:28` | Update pricing | Yes | `["adminConfigurations"]` |
| `features/admin/settings/components/AdminTripPricingCard.tsx:51` | Create pricing | Yes | `["adminConfigurations"]` |
| `features/admin/payouts/views/AdminPayoutsView.tsx:109` | Approve payout (list) | Yes | `["allPayouts"]` |
| `features/admin/payouts/components/payout-details/PayoutInfoCard.tsx:47` | Approve payout (detail) | Yes | `["payoutDetails", payoutId]`, `["allPayouts"]` |
| `features/admin/users/components/user-details/ProfilDetailsCard.tsx:49` | Block user | Yes | `["userDetails", userId]` |
| `features/admin/users/components/user-details/ProfilDetailsCard.tsx:65` | Unblock user | Yes | `["userDetails", userId]` |

---

## Missing Invalidations

### 1. Driver: accept/reject booking → booking details not invalidated
`DriverBookingDetailsView.tsx` — invalidates `["driverBookings"]` (list) but NOT `["driverBookingDetails", bookingId]`. Uses local `refetch()` but other open detail pages stay stale.

### 2. Driver: accept/reject booking → home page not invalidated
`["driverRecentBookings"]`, `["driverTripStats"]` on the home page won't update after accepting/rejecting a booking.

### 3. Driver: cancel trip → home page not invalidated
Invalidates `["driverTrips"]` but NOT `["driverTripStats"]`, `["driverTodayTrip"]`, or `["driverRecentBookings"]`.

### 4. Driver: create trip → home page not invalidated
Invalidates `["driverTrips"]` and `["userProfile"]` but NOT `["driverTripStats"]`, `["driverTodayTrip"]`.

### 5. Driver: journey mutations → bookings/home not invalidated
All 4 journey mutations in `CurrentTargetCard.tsx` only invalidate `["driverJourneyDetails", journeyId]`. After completing a journey, `["driverRecentBookings"]`, `["driverEarnings"]`, `["driverTripStats"]` remain stale.

### 6. Driver: complete journey → trips not invalidated
`completeJourneyMutation` doesn't invalidate `["driverTrips"]` or `["driverTodayTrip"]`.

### 7. Passenger: withdraw/cancel booking → booking details not invalidated
Invalidates `["passengerBookings"]` but NOT `["passengerBookingDetails", bookingId]`.

### 8. Passenger: withdraw/cancel booking → home stats not invalidated
`["passengerBookingStats"]`, `["passengerRecentBookings"]`, `["passengerWalletBalance"]` not invalidated.

### 9. Passenger: payment → home stats not invalidated
Both payment buttons invalidate `["passengerBookings"]` and `["passengerBookingDetails"]` but NOT `["passengerBookingStats"]`, `["passengerWalletBalance"]`, `["passengerRecentBookings"]`.

### 10. Passenger: confirm pickup → bookings not invalidated
Only invalidates `["passengerJourneyDetails"]`.

### 11. Profile: update profile → currentUser inconsistency
`ProfileUpdateForm.tsx` uses `setQueryData(["currentUser"])` but `ProfileUserCard.tsx` only invalidates `["userProfile"]`, missing `["currentUser"]`.

### 12. Profile: upload avatar → userProfile not invalidated
Invalidates `["currentUser"]` but NOT `["userProfile"]`.

### 13. Admin: block/unblock user → users list not invalidated
Invalidates `["userDetails", userId]` but NOT `["allUsers"]`.

### 14. Admin: approve payout (from list) → payout detail not invalidated
`AdminPayoutsView.tsx` approve only invalidates `["allPayouts"]`, not `["payoutDetails", payoutId]`.

---

## Bug: Admin staleTime values are likely wrong

Most admin list views set `staleTime: 60 * 10` which equals `600` — but TanStack Query interprets this as **600 milliseconds**, not 600 seconds. This means admin list pages effectively have no caching in production. The likely intent was `60 * 10 * 1000` (10 minutes) or `600 * 1000` (600 seconds).

Compare with `AdminConfigView.tsx` which correctly uses `60 * 1000` (60 seconds in ms).

---

## Strategy: Invalidation vs Reduced TTL

### Option A: Add targeted invalidation to mutations

**Pros:**
- Data updates instantly after user actions — the user sees what they just did reflected immediately
- No unnecessary network requests — queries only refetch when something actually changed
- Keeps the 5-minute default staleTime, which reduces load on the backend for read-heavy pages like home/dashboard
- Precise control — you invalidate exactly the related queries, nothing more
- This is the intended TanStack Query pattern: mutations invalidate related queries

**Cons:**
- Requires knowing the dependency graph between mutations and queries (this audit covers it)
- Each new mutation needs to remember to invalidate related queries
- Risk of missing an invalidation (which is the current problem)

### Option B: Reduce the default staleTime (e.g. 30s or 1m)

**Pros:**
- "Free" — no code changes to individual mutations
- Catches cases where data changes from external sources (e.g. another user, backend events)
- Simple to implement, one line change

**Cons:**
- Still not instant — user may see stale data for up to the TTL window after their own action
- Significantly more API calls — every page visit after the TTL triggers a refetch, even if nothing changed
- Home pages with 4 queries each would refetch 4x more often per visit
- Doesn't solve the core problem — user expects their own actions to be reflected immediately
- Higher backend load for no benefit on pages where data hasn't changed

### Recommendation: Do both, but invalidation is primary

1. **Add targeted invalidation for all 14 missing cases above** — this fixes the actual user-facing bugs where "I just did X but the page still shows old data"
2. **Keep the 5-minute staleTime as default** — it's reasonable for most pages
3. **Fix the admin staleTime bug** (`60 * 10` → `60 * 10 * 1000` or whatever was intended)
4. **Consider reducing staleTime to 2-3 minutes only for home/dashboard pages** if you want those to feel more "live" without relying solely on invalidation
