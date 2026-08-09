import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AddPlacesRequestDTO } from "#/application/dto/trip/AddPlacesRequestDTO";
import { AddPlacesUseCase } from "#/application/use-case/trip/AddPlacesUseCase";
import { PlacesRepository } from "#/infrastructure/repository/PlacesRepository";
import { H3GeoIndexingService } from "#/infrastructure/services/H3GeoIndexingService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PoiFeature {
  type: string;
  geometry?: {
    coordinates: [number, number]; // [lng, lat]
    type: string;
  };
  properties?: {
    name?: string;
    address?: string;
    full_address?: string;
    place_formatted?: string;
  };
}

/**
 * Seed script to populate places table using AddPlacesUseCase.
 */
async function seedPlaces(): Promise<void> {
  const jsonPath = path.resolve(__dirname, "../../../kerala_pois2.json");

  console.log(`Reading POI data from ${jsonPath}...`);
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const features: PoiFeature[] = JSON.parse(rawData);

  console.log(`Found ${features.length} POI features.`);

  const geoIndexingService = new H3GeoIndexingService(7);
  const placesRepository = new PlacesRepository(geoIndexingService);
  const addPlacesUseCase = new AddPlacesUseCase(placesRepository);

  const batchSize = 2000;
  let currentBatch: AddPlacesRequestDTO[] = [];
  let processedCount = 0;

  for (let i = 0; i < features.length; i++) {
    const item = features[i];
    if (
      !item ||
      !item.geometry ||
      !Array.isArray(item.geometry.coordinates) ||
      item.geometry.coordinates.length < 2
    ) {
      continue;
    }

    const [lng, lat] = item.geometry.coordinates;
    const props = item.properties || {};
    const name = props.name || "Unknown Place";
    const address =
      props.full_address || props.address || props.place_formatted || "";

    currentBatch.push({
      placeName: name,
      placeLat: lat,
      placeLng: lng,
      placeAddress: address,
    });

    if (currentBatch.length >= batchSize || i === features.length - 1) {
      console.log(
        `Executing AddPlacesUseCase for batch of ${currentBatch.length} items (${processedCount + currentBatch.length}/${features.length})...`,
      );
      await addPlacesUseCase.execute(currentBatch);
      processedCount += currentBatch.length;
      currentBatch = [];
    }
  }

  console.log(
    `Seeding complete! Successfully processed ${processedCount} places.`,
  );
}

seedPlaces().catch((err) => {
  console.error("Error seeding places:", err);
  process.exit(1);
});
