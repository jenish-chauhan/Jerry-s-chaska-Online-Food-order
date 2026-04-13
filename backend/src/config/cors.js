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

const normalizeHost = (value) => value.trim().toLowerCase().replace(/\/+$/, "");

const parseAllowedOriginRule = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (trimmedValue.includes("://")) {
    try {
      const parsedUrl = new URL(trimmedValue);

      return {
        type: "origin",
        displayValue: parsedUrl.origin,
        protocol: parsedUrl.protocol.toLowerCase(),
        hostname: parsedUrl.hostname.toLowerCase(),
        port: parsedUrl.port || "",
        allowAnyPort: !parsedUrl.port,
      };
    } catch (error) {
      return null;
    }
  }

  const normalizedValue = normalizeHost(trimmedValue);

  if (normalizedValue.startsWith("*.")) {
    const wildcardHostname = normalizedValue.slice(2);

    if (!wildcardHostname) {
      return null;
    }

    return {
      type: "wildcard-host",
      displayValue: trimmedValue,
      hostname: wildcardHostname,
    };
  }

  return {
    type: "host",
    displayValue: trimmedValue,
    hostname: normalizedValue,
  };
};

const parseRequestOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalizedOrigin);

    return {
      normalizedOrigin: parsedUrl.origin,
      protocol: parsedUrl.protocol.toLowerCase(),
      hostname: parsedUrl.hostname.toLowerCase(),
      port: parsedUrl.port || "",
    };
  } catch (error) {
    return null;
  }
};

const formatAllowedOrigins = (allowedOrigins) =>
  allowedOrigins.length > 0 ? allowedOrigins.join(", ") : "(none configured)";

const getAllowedOriginRules = () =>
  (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => parseAllowedOriginRule(origin))
    .filter(Boolean);

const getAllowedOrigins = () =>
  getAllowedOriginRules().map((rule) => rule.displayValue);

const isOriginAllowed = (
  origin,
  allowedOriginRules = getAllowedOriginRules(),
) => {
  if (!origin) {
    return true;
  }

  const parsedOrigin = parseRequestOrigin(origin);
  if (!parsedOrigin) {
    return false;
  }

  return allowedOriginRules.some((rule) => {
    if (rule.type === "origin") {
      if (
        parsedOrigin.protocol !== rule.protocol ||
        parsedOrigin.hostname !== rule.hostname
      ) {
        return false;
      }

      if (rule.allowAnyPort) {
        return true;
      }

      return parsedOrigin.port === rule.port;
    }

    if (rule.type === "host") {
      return parsedOrigin.hostname === rule.hostname;
    }

    if (rule.type === "wildcard-host") {
      return (
        parsedOrigin.hostname === rule.hostname ||
        parsedOrigin.hostname.endsWith(`.${rule.hostname}`)
      );
    }

    return false;
  });
};

const createOriginValidator = (context) => (origin, callback) => {
  const allowedOriginRules = getAllowedOriginRules();
  const allowedOrigins = allowedOriginRules.map((rule) => rule.displayValue);
  const parsedOrigin = parseRequestOrigin(origin);
  const normalizedOrigin =
    parsedOrigin?.normalizedOrigin || normalizeOrigin(origin);

  console.log(`[${context}] Incoming origin: ${origin || "(none)"}`);
  console.log(
    `[${context}] Allowed origins: ${formatAllowedOrigins(allowedOrigins)}`,
  );

  if (!origin) {
    console.log(`[${context}] Allowing request with no origin header`);
    callback(null, true);
    return;
  }

  if (isOriginAllowed(origin, allowedOriginRules)) {
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
  getAllowedOriginRules,
  isOriginAllowed,
  normalizeOrigin,
};
