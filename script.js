// Select elements from the page
const ipEl = document.getElementById("ip");
const cityEl = document.getElementById("city");
const regionEl = document.getElementById("region");
const countryEl = document.getElementById("country");
const statusEl = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");
const geoBtn = document.getElementById("geoBtn");

// Free IP geolocation API endpoint
// Returns IP + location details in JSON format
const API_URL = "https://ipapi.co/json/";

// Update the visible values
function updateData({ ip = "N/A", city = "N/A", region = "N/A", country = "N/A" }) {
  ipEl.textContent = ip;
  cityEl.textContent = city;
  regionEl.textContent = region;
  countryEl.textContent = country;
}

// Show status messages
function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#fca5a5" : "#cbd5e1";
}

// Load public IP and location
async function loadData() {
  try {
    setStatus("Fetching IP and location...");
    updateData({
      ip: "Loading...",
      city: "Loading...",
      region: "Loading...",
      country: "Loading..."
    });

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    updateData({
      ip: data.ip || "Unknown",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      country: data.country_name || data.country || "Unknown"
    });

    setStatus("Location loaded successfully.");
  } catch (error) {
    console.error("Load error:", error);
    updateData({
      ip: "Unavailable",
      city: "Unavailable",
      region: "Unavailable",
      country: "Unavailable"
    });
    setStatus("Could not load location data right now. Please try again.", true);
  }
}

// Optional browser location permission
function getLocation() {
  if (!navigator.geolocation) {
    setStatus("Browser location is not supported on this device.", true);
    return;
  }

  setStatus("Requesting browser location permission...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(5);
      const lon = position.coords.longitude.toFixed(5);
      setStatus(`Browser location allowed. Latitude: ${lat}, Longitude: ${lon}`);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setStatus("Location permission denied. IP lookup is still available.", true);
      } else {
        setStatus("Could not determine browser location.", true);
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

// Button events
refreshBtn.addEventListener("click", loadData);
geoBtn.addEventListener("click", getLocation);

// Auto load on page open
loadData();
