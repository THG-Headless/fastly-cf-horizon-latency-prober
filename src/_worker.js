export default {
  async fetch(request) {
    const { pathname } = new URL(request.url)
    if (request.method !== 'GET' || !/^\/[^/]+\/probe\/?$/.test(pathname)) {
      return new Response('Not found', { status: 404 })
    }
    const response = await fetchWithTimeout("https://horizon-api.www.lookfantastic.com/schema-docs")
    return new Response(response.body, {headers: {...Object.fromEntries(response.headers), ...{'Cache-Control': 'max-age=0, no-cache, no-store'}}})
  }
}

async function fetchWithTimeout(resource, timeout = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  let requestStartTime = new Date().getTime(),
      requestEndTime
  const response = await fetch(resource, {
    headers: {
      'X-Horizon-Client': 'altitude-shield-prober'
    },
    signal: controller.signal
  });
  requestEndTime = new Date().getTime()
  clearTimeout(id);
  return new Response(response.body, {headers:{'X-Horizon-Duration': `${requestEndTime - requestStartTime}`}})
}
