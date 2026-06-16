import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { acknowledgeAlert, alertsToPatients, fetchActiveAlerts, fetchRegisteredPatients } from "../services/api";

const LiveAlertsContext = createContext(null);

function useLiveAlertsState(pollInterval = 5000) {
  const [alerts, setAlerts] = useState([]);
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [activeAlerts, backendPatients] = await Promise.all([
        fetchActiveAlerts(),
        fetchRegisteredPatients(),
      ]);
      setAlerts(activeAlerts);
      setRegisteredPatients(backendPatients);
      setError("");
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Unable to load live alerts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    if (!pollInterval) return undefined;
    const intervalId = window.setInterval(refresh, pollInterval);
    return () => window.clearInterval(intervalId);
  }, [pollInterval, refresh]);

  const alertPatients = useMemo(() => alertsToPatients(alerts), [alerts]);
  const patients = useMemo(() => {
    const byPatient = new Map();

    registeredPatients.forEach((patient) => {
      byPatient.set(patient.id, patient);
    });

    alertPatients.forEach((patient) => {
      byPatient.set(patient.id, {
        ...byPatient.get(patient.id),
        ...patient,
      });
    });

    return Array.from(byPatient.values());
  }, [alertPatients, registeredPatients]);
  const reportPatients = useMemo(
    () => patients.filter((patient) => patient.reports?.length > 0),
    [patients]
  );
  const activePatients = useMemo(
    () => patients.filter((patient) => patient.admitted === "Yes" || patient.severity === "Critical"),
    [patients]
  );

  const acknowledge = useCallback(
    async (alertId) => {
      await acknowledgeAlert(alertId);
      await refresh();
    },
    [refresh]
  );

  return {
    alerts,
    patients,
    reportPatients,
    activePatients,
    isLoading,
    error,
    lastUpdated,
    refresh,
    acknowledge,
  };
}

export function LiveAlertsProvider({ children, pollInterval = 5000 }) {
  const value = useLiveAlertsState(pollInterval);

  return createElement(LiveAlertsContext.Provider, { value }, children);
}

export function useLiveAlerts() {
  const context = useContext(LiveAlertsContext);

  if (!context) {
    throw new Error("useLiveAlerts must be used inside LiveAlertsProvider.");
  }

  return context;
}
