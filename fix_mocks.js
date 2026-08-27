const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/home/aidrin-peraira/Projects/ShareMyRide/smr-backend/trip-service/tests/**/*.test.ts');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('mockBookingRepository = {')) {
    if (!content.includes('findAllBookings:')) {
      content = content.replace('mockBookingRepository = {', 'mockBookingRepository = {\n      findAllBookings: vi.fn(),\n      findAdminBookingDetails: vi.fn(),');
      changed = true;
    }
  }

  if (content.includes('mockTripRepository = {')) {
    if (!content.includes('findAllTrips:')) {
      content = content.replace('mockTripRepository = {', 'mockTripRepository = {\n      findAllTrips: vi.fn(),\n      findAdminTripDetails: vi.fn(),\n      findTripsByDriverId: vi.fn(),');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
