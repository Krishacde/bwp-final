const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("innoprocure_token") ? { Authorization: `Bearer ${localStorage.getItem("innoprocure_token")}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (cause) {
    console.error(`API request failed: ${path}`, cause);
    const error = new Error("Can't connect right now. Try again.");
    error.status = 0;
    throw error;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const requestId = response.headers.get("X-Request-ID") || payload.requestId || "unavailable";
    console.error("API request returned an error", {
      method: options.method || "GET",
      path,
      status: response.status,
      requestId,
      message: payload.message || response.statusText || "Unknown API error",
      contentType: response.headers.get("Content-Type"),
    });
    let message = "Something went wrong. Try again.";
    if (response.status === 400) {
      if (path.includes("forgot-password")) message = "Enter a valid email address.";
      else if (path.includes("reset-password")) message = payload.message?.includes("6 characters")
        ? "Use at least 6 characters for your password."
        : "Reset link is invalid or expired.";
      else if (path.includes("change-password")) message = payload.message?.includes("incorrect")
        ? "Current password is incorrect."
        : "Use at least 6 characters for your new password.";
      else message = "Check your information and try again.";
    } else if (response.status === 401) {
      message = path.includes("/login") ? "Email or password is incorrect." : "Your session expired. Sign in again.";
    } else if (response.status === 403) message = "You don't have access to do that.";
    else if (response.status === 404) message = path.includes("/api/auth/forgot-password")
        ? "No account found for that email. Check the address and try again."
        : "That item or API endpoint could not be found.";
    else if (response.status === 409) message = "That account already exists.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export const apiClient = {
  setToken(token) {
    if (token) localStorage.setItem("innoprocure_token", token);
    else localStorage.removeItem("innoprocure_token");
  },
  get(path) {
    return request(path);
  },
  post(path, body) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  patch(path, body) {
    return request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
};
