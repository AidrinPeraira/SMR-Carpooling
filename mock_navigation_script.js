let capturedCallback = null;
let currentLocation = { latitude: 9.999012, longitude: 76.300193 };

navigator.geolocation.watchPosition = (cb) => {
  capturedCallback = cb;
  return 1;
};

navigator.geolocation.getCurrentPosition = (cb) => {
  cb({
    coords: { ...currentLocation },
    timestamp: Date.now(),
  });
};

let interval = null;
let path = [];
let i = 0;

function setPath(p) {
  path = p;
  i = 0; // Reset index when setting a new path
}

function moveTo(lat, lng) {
  // Craft the full object the browser usually returns
  let position = {
    coords: {
      latitude: Number(lat),
      longitude: Number(lng),
    },
    timestamp: Date.now(),
  };

  currentLocation = { latitude: Number(lat), longitude: Number(lng) };

  if (capturedCallback) {
    capturedCallback(position);
  }
}

function startTraveling() {
  interval = setInterval(() => {
    if (i >= path.length) {
      clearInterval(interval);
      return;
    }

    // Call moveTo so the position object is crafted correctly
    moveTo(path[i][1], path[i][0]);
    i++;
  }, 1000); // 1-second interval
}

function stopTraveling() {
  clearInterval(interval);
}
