"use client";

import { Card, CardBody, Table, Tag } from "@smr/ui";

interface Trip {
  date: string;
  route: string;
  role: string;
  status: string;
}

const MOCK_TRIPS: Trip[] = [];

// const MOCK_TRIPS: Trip[] = [
//   {
//     date: "Oct 24, 2023",
//     route: "Mission Dist. to Financial Center",
//     role: "Driver",
//     status: "Completed",
//   },
//   {
//     date: "Oct 22, 2023",
//     route: "SOMA to Oakland (Bay Bridge)",
//     role: "Passenger",
//     status: "Completed",
//   },
// ];
//
export function TripDetailsCard() {
  const columns = [
    { headerName: "Date", fieldName: "date" as keyof Trip },
    { headerName: "Route", fieldName: "route" as keyof Trip },
    { headerName: "Role", fieldName: "role" as keyof Trip },
    {
      headerName: "Status",
      fieldName: "status" as keyof Trip,
      customRender: (val: unknown) => (
        <Tag variant="accent" className="uppercase tracking-wider">
          {String(val)}
        </Tag>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <h3 className="text-lg font-bold text-content-primary mb-6">
          User Trips
        </h3>
        <Table columnNames={columns} data={MOCK_TRIPS} />
      </CardBody>
    </Card>
  );
}
