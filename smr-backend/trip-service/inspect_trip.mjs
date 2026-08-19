import pg from "pg";
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
await client.connect();

const r1 = await client.query('SELECT COUNT(*) as cnt FROM "TripPlaces"');
const r2 = await client.query('SELECT COUNT(*) as cnt FROM "Places"');
const r3 = await client.query(
  'SELECT "tripId", "startTime" FROM "Trip" ORDER BY "createdAt" DESC LIMIT 1'
);

console.log("TripPlaces total:", r1.rows[0].cnt);
console.log("Places total:", r2.rows[0].cnt);

const latestTrip = r3.rows[0];
console.log("Latest trip:", JSON.stringify(latestTrip));

if (latestTrip) {
  const r4 = await client.query(
    'SELECT "tripId", "tripDate", "placeIndex", "seqNumber" FROM "TripPlaces" WHERE "tripId" = $1 LIMIT 5',
    [latestTrip.tripId]
  );
  const r5 = await client.query(
    'SELECT COUNT(*) as cnt FROM "TripPlaces" WHERE "tripId" = $1',
    [latestTrip.tripId]
  );
  console.log("TripPlaces count for latest trip:", r5.rows[0].cnt);
  console.log("TripPlaces sample:", JSON.stringify(r4.rows, null, 2));
}

await client.end();
