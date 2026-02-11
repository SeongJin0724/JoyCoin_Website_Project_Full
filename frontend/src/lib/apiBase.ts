const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
const IPV4_PATTERN = /^(?:\d{1,3}\.){3}\d{1,3}$/;

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

// Keep frontend/backend on the same host (localhost vs LAN IP) to avoid cookie issues.
export function getApiBaseUrl(): string {
  const configured = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();
  const fallback = "http://localhost:8000";

  if (typeof window === "undefined") {
    return stripTrailingSlash(configured || fallback);
  }

  if (!configured) {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  try {
    const url = new URL(configured);
    const frontendHost = window.location.hostname;
    const apiHost = url.hostname;
    const frontendIsLocal = LOCAL_HOSTS.has(frontendHost);
    const apiIsLocal = LOCAL_HOSTS.has(apiHost);
    const apiIsIpv4 = IPV4_PATTERN.test(apiHost);

    if ((frontendIsLocal && apiIsIpv4) || (!frontendIsLocal && apiIsLocal)) {
      url.hostname = frontendHost;
    }

    return stripTrailingSlash(url.toString());
  } catch {
    return stripTrailingSlash(configured);
  }
}

