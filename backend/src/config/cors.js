const DEFAULT_ALLOWED_HEADERS = ["Content-Type", "Authorization"];
const DEFAULT_EXPRESS_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
];
const DEFAULT_SOCKET_METHODS = ["GET", "POST"];

const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== "string") {
    return "";
  }

  const trimmedOrigin = origin.trim();
  if (!trimmedOrigin) {
    return "";
  }

  try {
    return new URL(trimmedOrigin).origin;
  } catch (error) {
    return trimmedOrigin.replace(/\/+$/, "");
  }
};

const formatAllowedOrigins = (allowedOrigins) =>
  allowedOrigins.length > 0 ? allowedOrigins.join(", ") : "(none configured)";

const getAllowedOrigins = () =>
  (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const isOriginAllowed = (origin, allowedOrigins = getAllowedOrigins()) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOrigins.some((allowedOrigin) => {
    if (normalizedOrigin === allowedOrigin) {
      return true;
    }

    // Allow the same scheme + host when the configured value omits a port.
    return normalizedOrigin.startsWith(`${allowedOrigin}:`);
  });
};

const createOriginValidator = (context) => (origin, callback) => {
  const allowedOrigins = getAllowedOrigins();
  const normalizedOrigin = normalizeOrigin(origin);

  console.log(`[${context}] Incoming origin: ${origin || "(none)"}`);
  console.log(
    `[${context}] Allowed origins: ${formatAllowedOrigins(allowedOrigins)}`,
  );

  if (!origin) {
    console.log(`[${context}] Allowing request with no origin header`);
    callback(null, true);
    return;
  }

  if (isOriginAllowed(normalizedOrigin, allowedOrigins)) {
    console.log(`[${context}] Origin allowed: ${normalizedOrigin}`);
    callback(null, true);
    return;
  }

  console.warn(`[${context}] Blocked origin: ${normalizedOrigin}`);
  const corsError = new Error("Not allowed by CORS");
  corsError.status = 403;
  callback(corsError);
};

const buildExpressCorsOptions = () => ({
  origin: createOriginValidator("Express CORS"),
  credentials: true,
  methods: DEFAULT_EXPRESS_METHODS,
  allowedHeaders: DEFAULT_ALLOWED_HEADERS,
});

const buildSocketCorsOptions = () => ({
  origin: createOriginValidator("Socket CORS"),
  credentials: true,
  methods: DEFAULT_SOCKET_METHODS,
});

module.exports = {
  buildExpressCorsOptions,
  buildSocketCorsOptions,
  getAllowedOrigins,
  isOriginAllowed,
  normalizeOrigin,
};
