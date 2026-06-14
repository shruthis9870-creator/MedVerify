import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Ambulance,
  ArrowUpRight,
  Clock3,
  LocateFixed,
  MapPin,
  RefreshCw,
  Route,
  SatelliteDish,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";
import {
  getCurrentPosition,
  getDrivingMetrics,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsSetupMessage,
  hasGoogleMapsKey,
  loadGoogleMaps,
  searchNearbyEmergencyHospitals,
} from "../services/googleMaps";

export default function AmbulanceTracking() {
  const mapElementRef = useRef(null);
  const googleRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapsStatus, setMapsStatus] = useState(hasGoogleMapsKey() ? "Getting your location..." : getGoogleMapsSetupMessage());
  const [mapsLoading, setMapsLoading] = useState(false);

  async function loadLiveMap() {
    if (!hasGoogleMapsKey()) return;

    setMapsLoading(true);
    setMapsStatus("Getting your location...");

    try {
      const [google, currentLocation] = await Promise.all([loadGoogleMaps(), getCurrentPosition()]);
      googleRef.current = google;
      setLocation(currentLocation);

      const map = new google.maps.Map(mapElementRef.current, {
        center: currentLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      mapRef.current = map;
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
      });

      clearMarkers();
      markersRef.current.push(
        new google.maps.Marker({
          position: currentLocation,
          map,
          title: "Your current location",
        })
      );

      setMapsStatus("Searching Google Places for nearby emergency hospitals...");
      const nearbyHospitals = await searchNearbyEmergencyHospitals({
        google,
        map,
        location: currentLocation,
      });
      const hospitalsWithMetrics = await getDrivingMetrics({
        google,
        origin: currentLocation,
        destinations: nearbyHospitals.slice(0, 8),
      });

      hospitalsWithMetrics.forEach((hospital) => {
        markersRef.current.push(
          new google.maps.Marker({
            position: hospital.location,
            map,
            title: hospital.name,
          })
        );
      });

      setHospitals(hospitalsWithMetrics);
      setSelectedHospital(hospitalsWithMetrics[0] || null);
      setMapsStatus(
        hospitalsWithMetrics.length
          ? "Showing real nearby hospitals and route estimates from Google Maps."
          : "No nearby emergency hospitals were returned by Google Places."
      );
    } catch (err) {
      setMapsStatus(err.message || "Unable to load Google Maps live data.");
    } finally {
      setMapsLoading(false);
    }
  }

  function clearMarkers() {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }

  useEffect(() => {
    loadLiveMap();

    return () => {
      clearMarkers();
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    const google = googleRef.current;
    const renderer = directionsRendererRef.current;

    if (!google || !renderer || !location || !selectedHospital) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: location,
        destination: selectedHospital.location,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
      },
      (result, status) => {
        if (status === "OK") {
          renderer.setDirections(result);
        }
      }
    );
  }, [location, selectedHospital]);

  return (
    <PageShell
      title="Ambulance Tracking"
      subtitle="Google Maps live location, nearby emergency facilities, and route estimates."
      status="Google Maps Real-Time Data"
    >
      <div className="space-y-8">
        <div className="rounded-[32px] bg-gradient-to-r from-cyan-600 to-slate-950 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Ambulance className="h-10 w-10" />
                <h1 className="text-4xl font-bold">Ambulance Control Center</h1>
              </div>

              <p className="mt-4 max-w-2xl text-lg text-cyan-100">
                Live map data is loaded from Google Maps. Ambulance vehicle locations will appear only after a real fleet GPS feed is connected.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/15 px-6 py-5 ring-1 ring-white/20 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Live Fleet Feed</p>
                <h2 className="mt-2 text-3xl font-bold">Not connected</h2>
              </div>
              <div className="rounded-3xl bg-white/15 px-6 py-5 ring-1 ring-white/20 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Tracked Ambulances</p>
                <h2 className="mt-2 text-5xl font-bold">0</h2>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-cyan-500" />
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Live Map</h2>
                  <p className="mt-1 text-sm text-slate-500">Current location, nearby hospitals, and selected route.</p>
                </div>
              </div>

              <button
                onClick={loadLiveMap}
                disabled={mapsLoading}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${mapsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              {location ? <LocateFixed className="h-5 w-5 text-emerald-600" /> : <MapPin className="h-5 w-5 text-cyan-600" />}
              <span>{mapsStatus}</span>
            </div>

            <div
              ref={mapElementRef}
              className="mt-6 h-[520px] overflow-hidden rounded-[28px] bg-slate-100 ring-1 ring-slate-200"
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <SatelliteDish className="h-7 w-7 text-cyan-500" />
                <h2 className="text-2xl font-bold text-slate-900">Fleet Feed</h2>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                No real ambulance dispatch or GPS provider is connected to this project yet. The page will not invent ambulance IDs, drivers, or positions.
              </p>

              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Connect a verified ambulance fleet API before displaying live ambulance vehicles.
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <Route className="h-7 w-7 text-cyan-500" />
                <h2 className="text-2xl font-bold text-slate-900">Nearest Facilities</h2>
              </div>

              <div className="mt-5 space-y-4">
                {!mapsLoading && hospitals.length === 0 && (
                  <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                    No real nearby hospital data is available yet.
                  </div>
                )}

                {hospitals.map((hospital) => (
                  <button
                    type="button"
                    key={hospital.placeId || hospital.name}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`w-full rounded-3xl p-4 text-left ring-1 transition ${
                      selectedHospital?.placeId === hospital.placeId
                        ? "bg-cyan-50 ring-cyan-200"
                        : "bg-white ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-950">{hospital.name}</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{hospital.address}</p>
                      </div>
                      {hospital.durationText && (
                        <span className="whitespace-nowrap rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                          {hospital.durationText}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                      {hospital.distanceText && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                          <MapPin className="h-3 w-3" />
                          {hospital.distanceText}
                        </span>
                      )}
                      {hospital.durationText && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                          <Clock3 className="h-3 w-3" />
                          Driving ETA
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedHospital && (
                <a
                  href={getGoogleMapsDirectionsUrl(selectedHospital)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open Selected Hospital
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
