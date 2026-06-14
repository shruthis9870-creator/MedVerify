const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const TOKEN_KEY = "medverify_token";

const severityMap = {
  HIGH: "Critical",
  CRITICAL: "Critical",
  MEDIUM: "Moderate",
  MODERATE: "Moderate",
  LOW: "Low",
  INFO: "Low",
};

function cleanPhone(value = "") {
  return String(value).replace(/^whatsapp:/i, "");
}

function displayPatientName(userId, payload = {}) {
  if (payload.patient_name) return payload.patient_name;
  if (payload.name) return payload.name;
  if (payload.profile_name) return payload.profile_name;

  const phone = cleanPhone(userId);
  const digits = phone.replace(/\D/g, "");
  return digits ? `Patient ${digits.slice(-4)}` : "Unknown patient";
}

function normalizeSeverity(value) {
  const key = String(value || "").trim().toUpperCase();
  return severityMap[key] || value || "Moderate";
}

function inferOrgan(text = "") {
  const normalized = text.toLowerCase();
  if (/(chest|heart|cardiac|breath|bp|blood pressure)/.test(normalized)) return "Cardiac";
  if (/(head|seizure|faint|confusion|brain)/.test(normalized)) return "Neurology";
  if (/(fever|infection|cough|cold)/.test(normalized)) return "General Medicine";
  if (/(stomach|abdomen|vomit|nausea)/.test(normalized)) return "Gastroenterology";
  return "Triage";
}

function normalizeReports(payload = {}) {
  const rawReports =
    payload.reports ||
    payload.report_urls ||
    payload.reportUrls ||
    payload.media_urls ||
    payload.mediaUrls ||
    payload.files ||
    [];

  if (!Array.isArray(rawReports)) return [];

  return rawReports.map((report, index) => {
    if (typeof report === "string") {
      const fileName = report.split("?")[0].split("/").pop() || `Report ${index + 1}`;
      return { name: fileName, url: report };
    }

    return {
      reportId: report.report_id || report.reportId || report.id,
      name: report.name || report.filename || report.url || `Report ${index + 1}`,
      url: report.url || report.media_url || report.href || "",
    };
  });
}

function formatTime(value) {
  if (!value) return "New";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "New";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function routePatientId(patientId) {
  return encodeURIComponent(patientId);
}

export function normalizeStoredReports(reports = []) {
  return reports.flatMap((report, reportIndex) => {
    const mediaUrls =
      report.media_urls ||
      report.mediaUrls ||
      report.media_url ||
      report.url ||
      [];
    const urls = Array.isArray(mediaUrls) ? mediaUrls : [mediaUrls];

    return urls.filter(Boolean).map((url, mediaIndex) => {
      const fileName =
        report.metadata?.filename ||
        String(url).split("?")[0].split("/").pop() ||
        `Report ${reportIndex + 1}.${mediaIndex + 1}`;

      return {
        reportId: report.report_id || report.id,
        name: fileName,
        url,
        createdAt: report.created_at,
      };
    });
  });
}

export function normalizeAlert(rawAlert = {}) {
  const payload = rawAlert.payload || {};
  const userId = rawAlert.user_id || payload.user_id || rawAlert.patient_id || "unknown";
  const mainSymptom = payload.main_symptom || payload.symptom || payload.report_raw || "";
  const severity = normalizeSeverity(rawAlert.severity || payload.severity);
  const reports = normalizeReports(payload);
  const patientName = displayPatientName(userId, payload);
  const reason = rawAlert.reason || payload.reason || "Patient requires clinical review";

  return {
    alertId: rawAlert.alert_id || rawAlert.id || userId,
    patientId: userId,
    patient: patientName,
    phone: cleanPhone(userId),
    issue: mainSymptom || reason,
    reason,
    severity,
    status: rawAlert.status || "open",
    action:
      payload.recommended_action ||
      payload.action ||
      (severity === "Critical"
        ? "Contact patient immediately and prepare emergency escalation."
        : "Review the patient triage details and follow up."),
    createdAt: rawAlert.created_at,
    createdLabel: formatTime(rawAlert.created_at),
    payload,
    reports,
  };
}

export function normalizeRegisteredPatient(rawPatient = {}) {
  const patientId = rawPatient.patientId || rawPatient.patient_id || rawPatient.userId || rawPatient.user_id;

  return {
    id: patientId || "unknown",
    name: rawPatient.name || rawPatient.email || "Unnamed patient",
    phone: cleanPhone(rawPatient.phone || patientId || ""),
    disease: "No active clinical alert",
    severity: "Low",
    organ: "Unassigned",
    age: "Not provided",
    admitted: "No",
    reports: [],
    symptoms: [],
    history: rawPatient.createdAt ? [`Registered ${formatTime(rawPatient.createdAt)}`] : ["Registered patient"],
    aiSuggestions: ["No clinical recommendation has been generated yet."],
    latestAlert: null,
  };
}

export function alertsToPatients(alerts = []) {
  const byPatient = new Map();

  alerts.forEach((alert) => {
    const current = byPatient.get(alert.patientId);
    const reports = alert.reports || [];
    const symptom = alert.payload?.main_symptom || alert.issue;
    const historyItem = `${alert.createdLabel}: ${alert.reason}${symptom ? ` (${symptom})` : ""}`;

    if (!current) {
      byPatient.set(alert.patientId, {
        id: alert.patientId,
        name: alert.patient,
        phone: alert.phone,
        disease: symptom || alert.reason,
        severity: alert.severity,
        organ: inferOrgan(`${symptom} ${alert.reason}`),
        age: alert.payload?.age || "Not provided",
        admitted: alert.severity === "Critical" ? "Yes" : "No",
        reports,
        symptoms: symptom ? [symptom] : [alert.reason],
        history: [historyItem],
        aiSuggestions: [alert.action, alert.reason],
        latestAlert: alert,
      });
      return;
    }

    current.history = [historyItem, ...current.history];
    current.reports = [...current.reports, ...reports].filter(
      (report, index, all) => all.findIndex((item) => item.url === report.url && item.name === report.name) === index
    );
    current.symptoms = Array.from(new Set([...current.symptoms, symptom || alert.reason]));
    current.aiSuggestions = Array.from(new Set([alert.action, alert.reason, ...current.aiSuggestions]));
    current.severity =
      current.severity === "Critical" || alert.severity !== "Critical"
        ? current.severity
        : alert.severity;
  });

  return Array.from(byPatient.values());
}

function getStoredToken() {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const { auth = true, headers = {}, ...fetchOptions } = options;
  const token = auth ? getStoredToken() : null;
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
    ...(token && !headers.Authorization ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: requestHeaders,
    ...fetchOptions,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Keep the generic message when the backend did not return JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

async function requestBlob(path, options = {}) {
  const { auth = true, headers = {}, ...fetchOptions } = options;
  const token = auth ? getStoredToken() : null;
  const requestHeaders = {
    ...headers,
    ...(token && !headers.Authorization ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: requestHeaders,
    ...fetchOptions,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Keep the generic message when the backend did not return JSON.
    }

    throw new Error(message);
  }

  return response.blob();
}

export async function signupUser(payload) {
  return request("/auth/signup", {
    auth: false,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return request("/auth/login", {
    auth: false,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function requestLoginOtp(payload) {
  return request("/auth/otp/request", {
    auth: false,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function verifyLoginOtp(payload) {
  return request("/auth/otp/verify", {
    auth: false,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentUser(token) {
  return request("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchActiveAlerts() {
  const data = await request("/alerts/active");
  return Array.isArray(data.alerts) ? data.alerts.map(normalizeAlert) : [];
}

export async function fetchRegisteredPatients() {
  const data = await request("/patients");
  return Array.isArray(data.patients) ? data.patients.map(normalizeRegisteredPatient) : [];
}

export async function fetchPatientReports(patientId) {
  const data = await request(`/reports/patient/${routePatientId(patientId)}`);
  return normalizeStoredReports(Array.isArray(data.reports) ? data.reports : []);
}

export async function uploadPatientReport({ patientId, patientName, file }) {
  const formData = new FormData();
  formData.append("file", file);

  if (patientName) {
    formData.append("patient_name", patientName);
  }

  return request(`/reports/patient/${routePatientId(patientId)}/upload`, {
    method: "POST",
    body: formData,
  });
}

export async function openReportFile(report) {
  if (!report?.reportId) {
    throw new Error("This report does not have a secure download identifier.");
  }

  const blob = await requestBlob(`/reports/${encodeURIComponent(report.reportId)}/file`);
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank", "noopener,noreferrer");

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60_000);
}

export async function acknowledgeAlert(alertId) {
  return request(`/alerts/${encodeURIComponent(alertId)}/ack`, { method: "POST" });
}

export async function fetchRoutingAssignments() {
  return request("/routing/assignments");
}

export async function syncRoutingAssignments() {
  return request("/routing/assignments/sync", { method: "POST" });
}

export async function updateRoutingAssignmentStatus(assignmentId, status) {
  return request(`/routing/assignments/${encodeURIComponent(assignmentId)}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
