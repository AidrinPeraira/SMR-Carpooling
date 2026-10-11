let capturedCallback = null;

// Override native API
navigator.geolocation.watchPosition = (cb) => {
  capturedCallback = cb;
  return 1;
};

let interval = null;
let path = [];
let i = 0;

function setPath(p) {
  path = p;
  i = 0; // Reset index when setting a new path
}

function moveTo(lng, lat) {
  // Craft the full object the browser usually returns
  let position = {
    coords: {
      latitude: Number(lat),
      longitude: Number(lng),
    },
    timestamp: Date.now(),
  };

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
    moveTo(path[i][0], path[i][1]);
    i++;
  }, 1000); // 1-second interval
}

function stopTraveling() {
  clearInterval(interval);
}
