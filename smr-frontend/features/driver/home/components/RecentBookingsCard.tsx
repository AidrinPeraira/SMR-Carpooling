import { Avatar, Button, Table, Tag } from "@sharemyride/ui";
import type { Column } from "@sharemyride/ui";

interface Booking {
  id: string;
  passengerName: string;
  passengerInitials: string;
  bookedAt: string;
  routeFrom: string;
  routeTo: string;
  seats: number;
  status: "pending" | "confirmed" | "completed";
  fare: number;
}

interface Props {
  bookings: Booking[];
}

const statusVariant: Record<Booking["status"], "muted" | "accent"> = {
  pending: "muted",
  confirmed: "accent",
  completed: "muted",
};

const statusLabel: Record<Booking["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
};

const columns: Column<Booking>[] = [
  {
    headerName: "Booking ID",
    customRender: (_, row) => (
      <span className="font-mono text-content-secondary">#{row.id}</span>
    ),
  },
  {
    headerName: "Passenger",
    customRender: (_, row) => (
      <div className="flex items-center gap-2">
        <Avatar initials={row.passengerInitials} size="sm" />
        <div>
          <span className="font-semibold text-content-primary block">
            {row.passengerName}
          </span>
          <span className="text-[11px] text-content-secondary">
            {row.bookedAt}
          </span>
        </div>
      </div>
    ),
  },
  {
    headerName: "Route",
    customRender: (_, row) => (
      <div>
        <span className="font-medium text-content-primary block">
          {row.routeFrom}
        </span>
        <span className="text-[11px] text-content-secondary">
          → {row.routeTo}
        </span>
      </div>
    ),
  },
  {
    headerName: "Seats",
    customRender: (_, row) => (
      <span className="text-content-secondary font-medium">
        {row.seats} Seat{row.seats > 1 ? "s" : ""}
      </span>
    ),
  },
  {
    headerName: "Status",
    customRender: (_, row) => (
      <Tag variant={statusVariant[row.status]}>{statusLabel[row.status]}</Tag>
    ),
  },
  {
    headerName: "Fare",
    customRender: (_, row) => (
      <span className="font-bold text-content-primary">
        ₹{row.fare.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    headerName: "Actions",
    align: "right",
    customRender: (_, row) => {
      if (row.status === "pending") {
        return <Button className="text-xs px-2.5 py-1">Review</Button>;
      }
      if (row.status === "completed") {
        return (
          <Button variant="secondary" className="text-xs px-2.5 py-1">
            Receipt
          </Button>
        );
      }
      return (
        <Button variant="secondary" className="text-xs px-2.5 py-1">
          View
        </Button>
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
        <a
          href="#"
          className="text-accent text-xs font-semibold hover:underline"
        >
          View All Bookings
        </a>
      </div>
      <Table<Booking> columnNames={columns} data={bookings} />
    </section>
  );
}
