import { apiRequest } from "./queryClient";

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = sessionStorage.getItem("demo_session_id");
    if (!sessionId) {
      sessionId = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("demo_session_id", sessionId);
    }
  }
  return sessionId;
}

export function trackDemoEvent(eventType: string, metadata?: Record<string, unknown>) {
  apiRequest("POST", "/api/demo-events", {
    eventType,
    sessionId: getSessionId(),
    metadata: metadata || undefined,
  }).catch(() => {});
}
