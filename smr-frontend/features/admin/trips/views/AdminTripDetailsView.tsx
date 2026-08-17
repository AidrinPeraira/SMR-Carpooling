"use client";

import { useQuery } from "@tanstack/react-query";
import { Button, Card, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { useRouter } from "next/navigation";
import { getAdminTripDetailsRequest } from "../api/requests/getAdminTripDetailsRequest";
import { AdminBookingItemForTripDetailsDTO } from "@sharemyride/shared";

interface Props {
  tripId: string;
}

export function AdminTripDetailsView({ tripId }: Props) {
  const router = useRouter();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminTripDetails", tripId],
    queryFn: async () => {
      return await getAdminTripDetailsRequest(tripId);
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <InlineError message={`Error fetching trip details: ${String(error)}`} />;
  }

  if (!data || !data.success || !data.payload) {
    return (
      <InlineError
        message={`Error: ${data?.message || "Failed to load trip details"}`}
      />
    );
  }

  const trip = data.payload;

  const bookingsTableData: TableProps<AdminBookingItemForTripDetailsDTO> = {
    data: trip.bookings ?? [],
    columnNames: [
      { headerName: "Booking ID", fieldName: "booking_id" },
      { headerName: "Passenger", fieldName: "passenger_name" },
      { headerName: "Origin", fieldName: "booking_origin" },
      { headerName: "Destination", fieldName: "booking_destination" },
      {
        headerName: "Status",
        fieldName: "booking_status",
        customRender: (v) => <Tag>{String(v).toUpperCase()}</Tag>,
      },
      {
        headerName: "Action",
        customRender: (_v, row) => (
          <Button
            onClick={() => router.push(`/admin/bookings/${row.booking_id}`)}
            variant="ghost"
            className="text-xs"
          >
            View Details
          </Button>
        ),
        align: "right",
      },
    ],
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content-primary">Trip Details</h1>
        <Button variant="ghost" onClick={() => router.back()}>
          Back to Trips
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Trip Info
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">Trip ID</span>
              <span className="font-mono text-content-primary">{trip.trip_id}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Date</span>
              <span className="text-content-primary">
                {new Date(trip.trip_date).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Origin</span>
              <span className="text-content-primary font-medium">
                {trip.trip_origin?.stop_name || trip.trip_origin?.stop_address || "-"}
              </span>
            </div>
            <div>
              <span className="text-content-secondary block">Destination</span>
              <span className="text-content-primary font-medium">
                {trip.trip_destination?.stop_name || trip.trip_destination?.stop_address || "-"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
            Driver & Vehicle
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-content-secondary block">Driver ID</span>
              <span className="font-mono text-content-primary">{trip.driver_id}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Driver Name</span>
              <span className="text-content-primary font-medium">{trip.driver_name}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Vehicle ID</span>
              <span className="font-mono text-content-primary">{trip.vehicle_id}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Vehicle Name</span>
              <span className="text-content-primary font-medium">{trip.vehicle_name}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-content-primary border-b border-border pb-2">
          Passenger Bookings ({trip.bookings?.length || 0})
        </h2>
        {trip.bookings?.length > 0 ? (
          <Table columnNames={bookingsTableData.columnNames} data={bookingsTableData.data} />
        ) : (
          <p className="text-sm text-content-secondary italic">No bookings for this trip yet.</p>
        )}
      </Card>
    </div>
  );
}
