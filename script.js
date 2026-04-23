// Select elements from the page
const ipEl = document.getElementById("ip");
const cityEl = document.getElementById("city");
const regionEl = document.getElementById("region");
const countryEl = document.getElementById("country");
const statusEl = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");
const geoBtn = document.getElementById("geoBtn");

// APIs:
// 1) ipify = public IPv4 only
// 2) ipapi = location details
const IPV4_API_URL = "https://api4.ipify.org?format=json";
const LOCATION_API_URL = "https://ipapi.co/json/";

// Update UI values
function updateData({ ip = "N/A", city = "N/A", region = "N/A", country = "N/A" }) {
  ipEl.textContent = ip;
  cityEl.textContent = city;
  regionEl.textContent = region;
  countryEl.textContent = country;
}

// Show status message
function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#fca5a5" : "#cbd5e1";
}

// Load IPv4 address + location
async function loadData() {
  try {
    setStatus("Fetching IPv4 address and location...");

    // Get IPv4 address
    const ipResponse = await fetch(IPV4_API_URL);
    if (!ipResponse.ok) {
      throw new Error("Failed to fetch IPv4 address");
    }
    const ipData = await ipResponse.json();

    // Get location data
    const locationResponse = await fetch(LOCATION_API_URL);
    if (!locationResponse.ok) {
      throw new Error("Failed to fetch location data");
    }
    const locationData = await locationResponse.json();

    // Update screen
    updateData({
      ip: ipData.ip || "Unknown IPv4",
      city: locationData.city || "Unknown",
      region: locationData.region || "Unknown",
      country: locationData.country_name || locationData.country || "Unknown"
    });

    setStatus("IPv4 and location loaded successfully.");
  } catch (error) {
    console.error("Error loading data:", error);

    updateData({
      ip: "Unavailable",
      city: "Unavailable",
      region: "Unavailable",
      country: "Unavailable"
    });

    setStatus("Could not fetch IPv4 or location right now. Try again later.", true);
  }
}

// Optional browser location
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
        setStatus("Location permission denied. IPv4 lookup still works.", true);
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

// Auto-load when page opens
loadData();
