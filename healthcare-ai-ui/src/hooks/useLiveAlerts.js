import { useCallback, useEffect, useMemo, useState } from "react";
import { acknowledgeAlert, alertsToPatients, fetchActiveAlerts } from "../services/api";

export function useLiveAlerts(pollInterval = 5000) {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const activeAlerts = await fetchActiveAlerts();
      setAlerts(activeAlerts);
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

  const patients = useMemo(() => alertsToPatients(alerts), [alerts]);
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

