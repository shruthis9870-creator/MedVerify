const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const CALLBACK_NAME = "__medverifyGoogleMapsReady";

let googleMapsPromise;

export function hasGoogleMapsKey() {
  return Boolean(GOOGLE_MAPS_API_KEY);
}

export function getGoogleMapsSetupMessage() {
  return "Add VITE_GOOGLE_MAPS_API_KEY to the frontend .env file and enable Maps JavaScript API, Places API, and Distance Matrix API.";
}

export function loadGoogleMaps() {
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error(getGoogleMapsSetupMessage()));
  }

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[data-medverify-google-maps]");

    window[CALLBACK_NAME] = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
        return;
      }

      reject(new Error("Google Maps loaded without the Places library."));
    };

    if (existingScript) {
      existingScript.addEventListener("error", () => {
        reject(new Error("Unable to load Google Maps JavaScript API."));
      });
      return;
    }

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      libraries: "places",
      callback: CALLBACK_NAME,
      v: "weekly",
    });

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.dataset.medverifyGoogleMaps = "true";
    script.onerror = () => reject(new Error("Unable to load Google Maps JavaScript API."));

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export function getCurrentPosition() {
  if (!navigator.geolocation) {
    return Promise.reject(new Error("Location access is not available in this browser."));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => reject(new Error("Allow location access to show real nearby emergency facilities.")),
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 12_000,
      }
    );
  });
}

export function searchNearbyEmergencyHospitals({ google, map, location, radius = 10000 }) {
  const service = new google.maps.places.PlacesService(map);

  return new Promise((resolve, reject) => {
    service.nearbySearch(
      {
        location,
        radius,
        type: "hospital",
        keyword: "emergency hospital",
      },
      (results, status) => {
        const placesStatus = google.maps.places.PlacesServiceStatus;

        if (status === placesStatus.OK || status === placesStatus.ZERO_RESULTS) {
          resolve((results || []).map(normalizePlace).filter(Boolean));
          return;
        }

        reject(new Error(`Google Places search failed: ${status}`));
      }
    );
  });
}

export function getDrivingMetrics({ google, origin, destinations }) {
  if (!destinations.length) {
    return Promise.resolve([]);
  }

  const service = new google.maps.DistanceMatrixService();

  return new Promise((resolve) => {
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: destinations.map((place) => place.location),
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status !== "OK") {
          resolve(destinations);
          return;
        }

        const elements = response?.rows?.[0]?.elements || [];
        resolve(
          destinations.map((place, index) => {
            const element = elements[index];
            if (element?.status !== "OK") return place;

            return {
              ...place,
              distanceText: element.distance?.text,
              durationText: element.duration_in_traffic?.text || element.duration?.text,
            };
          })
        );
      }
    );
  });
}

export function getGoogleMapsDirectionsUrl(place) {
  if (!place) return "https://www.google.com/maps";

  const query = encodeURIComponent(place.name || `${place.location.lat},${place.location.lng}`);
  const placeId = place.placeId ? `&query_place_id=${encodeURIComponent(place.placeId)}` : "";

  return `https://www.google.com/maps/search/?api=1&query=${query}${placeId}`;
}

function normalizePlace(place) {
  const location = place.geometry?.location;
  if (!location) return null;

  return {
    placeId: place.place_id,
    name: place.name || "Unnamed emergency facility",
    address: place.vicinity || place.formatted_address || "Address unavailable",
    rating: place.rating,
    isOpenNow: place.opening_hours?.open_now,
    location: {
      lat: location.lat(),
      lng: location.lng(),
    },
  };
}
