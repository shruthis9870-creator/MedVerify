import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ambulance,
  ArrowUpRight,
  Clock3,
  HeartPulse,
  LocateFixed,
  MapPin,
  Phone,
  RefreshCw,
  Siren,
  TriangleAlert,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import {
  getCurrentPosition,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsSetupMessage,
  hasGoogleMapsKey,
  loadGoogleMaps,
  searchNearbyEmergencyHospitals,
} from "../services/googleMaps";

function isEmergencyAlert(alert) {
  const combined = [
    alert.severity,
    alert.reason,
    alert.issue,
    alert.action,
    alert.payload?.case_type,
    alert.payload?.source,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /(critical|emergency|urgent|ambulance|trauma|cardiac|stroke|breath|severe)/.test(combined);
}

function EmergencyPlaceCard({ place }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{place.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{place.address}</p>
        </div>

        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          Google Places
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
        {place.rating && (
          <span className="rounded-full bg-slate-100 px-3 py-1">Rating {place.rating}</span>
        )}
        {typeof place.isOpenNow === "boolean" && (
          <span
            className={`rounded-full px-3 py-1 ${
              place.isOpenNow ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {place.isOpenNow ? "Open now" : "Hours may vary"}
          </span>
        )}
      </div>

      <a
        href={getGoogleMapsDirectionsUrl(place)}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Open in Google Maps
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function Emergency() {
  const navigate = useNavigate();
  const { alerts, isLoading: alertsLoading, error: alertsError, lastUpdated, refresh } = useLiveAlerts();
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [mapsStatus, setMapsStatus] = useState(hasGoogleMapsKey() ? "Getting your location..." : getGoogleMapsSetupMessage());
  const [mapsLoading, setMapsLoading] = useState(false);

  const emergencyAlerts = useMemo(() => alerts.filter(isEmergencyAlert), [alerts]);

  useEffect(() => {
    let isMounted = true;

    async function loadNearbyFacilities() {
      if (!hasGoogleMapsKey()) return;

      setMapsLoading(true);
      setMapsStatus("Getting your location...");

      try {
        const [google, currentLocation] = await Promise.all([loadGoogleMaps(), getCurrentPosition()]);
        if (!isMounted) return;

        setLocation(currentLocation);
        setMapsStatus("Searching Google Places for nearby emergency hospitals...");

        const map = new google.maps.Map(document.createElement("div"), {
          center: currentLocation,
          zoom: 13,
        });
        const results = await searchNearbyEmergencyHospitals({
          google,
          map,
          location: currentLocation,
        });

        if (!isMounted) return;
        setPlaces(results.slice(0, 6));
        setMapsStatus(results.length ? "Showing nearby emergency hospitals from Google Places." : "No nearby emergency hospitals were returned by Google Places.");
      } catch (err) {
        if (!isMounted) return;
        setMapsStatus(err.message || "Unable to load real emergency facilities.");
      } finally {
        if (isMounted) setMapsLoading(false);
      }
    }

    loadNearbyFacilities();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageShell
      title="Emergency Response"
      subtitle="Live critical alerts and nearby emergency facilities from real data sources."
      status="Real-Time Emergency Data"
    >
      <div className="space-y-8">
        <div className="rounded-[32px] bg-gradient-to-r from-red-600 to-slate-950 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Siren className="h-10 w-10" />
                <h1 className="text-4xl font-bold">Emergency Assistance</h1>
              </div>

              <p className="mt-4 max-w-2xl text-lg text-red-100">
                Use verified emergency contacts, live patient alerts, and Google Maps data for nearby emergency care.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:112"
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-lg"
              >
                <Phone className="h-4 w-4" />
                Call 112
              </a>
              <a
                href="tel:108"
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white/15 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30"
              >
                <Ambulance className="h-4 w-4" />
                Call 108
              </a>
              <button
                onClick={() => navigate("/ambulance-tracking")}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white/15 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30"
              >
                <MapPin className="h-4 w-4" />
                Open Map
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <TriangleAlert className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Live Emergency Alerts</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing only backend alerts that are critical, urgent, or emergency-related.
                </p>
              </div>
            </div>

            <button
              onClick={refresh}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {alertsLoading && (
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">Loading live backend alerts...</div>
            )}

            {alertsError && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{alertsError}</div>
            )}

            {!alertsLoading && !alertsError && emergencyAlerts.length === 0 && (
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
                No live emergency alerts are currently available from the backend.
              </div>
            )}

            {emergencyAlerts.map((alert) => (
              <div key={alert.alertId} className="rounded-3xl border border-red-100 bg-red-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-red-800">{alert.patient}</h3>
                    <p className="mt-2 text-sm leading-6 text-red-700">{alert.reason}</p>
                    {alert.issue && <p className="mt-1 text-sm text-red-700">Issue: {alert.issue}</p>}
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-700">
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {lastUpdated && (
            <p className="mt-5 text-xs text-slate-500">Last backend refresh: {lastUpdated.toLocaleString()}</p>
          )}
        </section>

        <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Nearby Emergency Facilities</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Results come from your current location and Google Places.
                </p>
              </div>
            </div>

            {location && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <LocateFixed className="h-4 w-4" />
                Location allowed
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            {mapsLoading ? <Clock3 className="h-5 w-5 animate-spin text-red-500" /> : <MapPin className="h-5 w-5 text-red-500" />}
            <span>{mapsStatus}</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => (
              <EmergencyPlaceCard key={place.placeId || place.name} place={place} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
