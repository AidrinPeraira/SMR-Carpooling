"use client";

import { OfferTripCard } from "../components/OfferTripCard";
import { ActiveTripCard } from "../components/ActiveTripCard";
import { DriverTripsCard } from "../components/DriverTripsCard";

/*
const MOCK_ACTIVE_TRIP = {
  tripId: "trip-101",
  origin: "San Jose, CA",
  destination: "San Francisco, CA",
  startTime: "05:30 PM",
  passengersCount: 3,
};

const MOCK_PAST_TRIPS = [
  {
    tripId: "trip-001",
    origin: "San Francisco, CA",
    destination: "San Jose, CA",
    departureTime: "Oct 24, 08:00 AM",
    arrivalTime: "Oct 24, 09:15 AM",
    passengersCount: 2,
    passengerAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7OWlIszHf9Yq7-4xX0mVsJOIHvu9zDtUbMqzt5CV4yqVGiH3ze_cb365ngtkrtwEa1BFwieAnoDSlkFW8vYQqJZ53javutMdm2blY52QVCQeBv8JoPPX2r3zVEXrJLuLvngRy6GyIOHOkWg-LaTKThDSXyBeyAwqdfBZuMYV_uKSEiM6hfDboDyWuo5H2h9wt145BQpOCHtCbl2DAGItteZpJAUm9w2OW8oWJO5SqCcutiZSK9puu5A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ2ytjFhnhIF30aPJg5_M3_1UWEb5eoB8eqimIUjd3GYYHGnAAeAUAeVUMPDC5Fk9BGkaxp3xbZJIst9wSIw0GHSXTAI4curDMKjFABSxaX6FOg1_wC_D73TOMnAPaoc64dumTu05DzDTBE2ic03OGLO7GDjJq3eYOHAuPQPo-M70PcQ0E7onJAMWDz1NEAeUqmNtUCXAcp0Mxb6w2s67fZZHdevcMgQxwhyQGDrF05TBML69UTHOIVg",
    ],
    earnings: 34.0,
    status: TripStatus.COMPLETED,
  },
  {
    tripId: "trip-002",
    origin: "Oakland, CA",
    destination: "Palo Alto, CA",
    departureTime: "Oct 20, 05:30 PM",
    arrivalTime: "Oct 20, 06:45 PM",
    passengersCount: 1,
    passengerAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_W39OznKd5GXiKTEWPTpPg7QGYQA0S0dBCElDumy6O5S_EFO5mnXdtrBAT5NC5aXNjPu1BXp9SRMsSca2jvfk81JOYIFNhz6VNhfQLb68dkAWLljTVNStGzDpJ3JH46tk8oE1tAJlsc5ICtXXa4A_nav7Yn5DDFHpAve7IXMHOa8A9ZNLowEhuVezt3v04OQElqxmTC_L7g-WxL19VEqWeAqiqdMiRYhXTtlVdeZm-EnUmfx-5j2z9Q",
    ],
    earnings: 22.5,
    status: TripStatus.COMPLETED,
  },
  {
    tripId: "trip-003",
    origin: "Berkeley, CA",
    destination: "San Francisco, CA",
    departureTime: "Oct 18, 10:00 AM",
    arrivalTime: "Oct 18, 11:00 AM",
    passengersCount: 0,
    earnings: 0.0,
    status: TripStatus.CANCELLED,
  },
];
*/

export function DriverTripsView() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar / Quick Actions */}
      <aside className="lg:col-span-3 flex flex-col gap-6">
        <OfferTripCard />
        <ActiveTripCard activeTrip={null} />
      </aside>

      {/* Main Content Area */}
      <section className="lg:col-span-9 flex flex-col gap-6">
        <DriverTripsCard trips={[]} />
      </section>
    </div>
  );
}
