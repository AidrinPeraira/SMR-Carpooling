import { Button, Table, Tag } from "@sharemyride/ui";
import type { Column } from "@sharemyride/ui";
import { DriverBookingItemDTO } from "@sharemyride/shared";
import Link from "next/link";

interface Props {
  bookings: DriverBookingItemDTO[];
}

const statusVariant: Record<string, "muted" | "accent"> = {
  requested: "muted",
  payment_pending: "muted",
  confirmed: "accent",
  completed: "muted",
  cancelled: "muted",
  rejected: "muted",
  withdrawn: "muted",
};

const columns: Column<DriverBookingItemDTO>[] = [
  {
    headerName: "Booking ID",
    customRender: (_, row) => (
      <span className="font-mono text-content-secondary">
        #{row.booking_id.slice(0, 8)}
      </span>
    ),
  },
  {
    headerName: "Passenger",
    customRender: (_, row) => (
      <div>
        <span className="font-semibold text-content-primary block">
          {row.passenger_name}
        </span>
        <span className="text-[11px] text-content-secondary">
          {new Date(row.trip_date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    ),
  },
  {
    headerName: "Route",
    customRender: (_, row) => (
      <div>
        <span className="font-medium text-content-primary block">
          {row.pickup_point_name || row.pickup_point_address}
        </span>
        <span className="text-[11px] text-content-secondary">
          → {row.drop_off_point_name || row.drop_off_point_address}
        </span>
      </div>
    ),
  },
  {
    headerName: "Seats",
    customRender: (_, row) => (
      <span className="text-content-secondary font-medium">
        {row.seat_count} Seat{row.seat_count > 1 ? "s" : ""}
      </span>
    ),
  },
  {
    headerName: "Status",
    customRender: (_, row) => (
      <Tag variant={statusVariant[row.status] || "muted"}>
        {row.status.replace("_", " ")}
      </Tag>
    ),
  },
  {
    headerName: "Fare",
    customRender: (_, row) => (
      <span className="font-bold text-content-primary">
        ₹{row.total_price.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    headerName: "Actions",
    align: "right",
    customRender: (_, row) => {
      if (row.status === "requested") {
        return (
          <Link href={`/driver/bookings/${row.booking_id}`}>
            <Button className="text-xs px-2.5 py-1">Review</Button>
          </Link>
        );
      }
      if (row.status === "completed") {
        return (
          <Link href={`/driver/bookings/${row.booking_id}`}>
            <Button variant="secondary" className="text-xs px-2.5 py-1">
              Receipt
            </Button>
          </Link>
        );
      }
      return (
        <Link href={`/driver/bookings/${row.booking_id}`}>
          <Button variant="secondary" className="text-xs px-2.5 py-1">
            View
          </Button>
        </Link>
      );
    },
  },
];

export function RecentBookingsCard({ bookings }: Props) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-content-primary">
            Recent Bookings
          </h2>
          <p className="text-xs text-content-secondary">
            Latest passenger requests and reservations
          </p>
        </div>
        <Link
          href="/driver/bookings"
          className="text-accent text-xs font-semibold hover:underline"
        >
          View All Bookings
        </Link>
      </div>
      <Table<DriverBookingItemDTO> columnNames={columns} data={bookings} />
    </section>
  );
}
