export default defineEventHandler((event) => {
  const path = event.path

  // Only apply to Vicket API routes (SRP: Scope isolation)
  if (path.startsWith('/api/vicket')) {
    // 1. Check Rate Limit (Basic protection against DDoS/Brute force)
    checkRateLimit(event)

    // 2. Check Body Size (Protection against heavy file injection)
    // We allow 15MB to account for multiple attachments + form metadata
    if (['POST', 'PUT', 'PATCH'].includes(event.method)) {
      checkBodySize(event)
    }

    // 3. Centralized Error Interception (Monitoring Strategy)
    try {
      // Logic for monitoring can be added here if we want to wrap the response
      // But in H3, it's better to use an error hook if available.
    } catch {
      // Fail silently
    }
  }
})
