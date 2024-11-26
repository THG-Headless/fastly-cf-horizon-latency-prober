export const GET = async ({ params, request }) => {
    const response = await fetchWithTimeout("https://horizon-api.www.lookfantastic.com/schema-docs")

    return new Response(response.body, {headers:{'Cache-Control': 'max-age=0, no-cache, no-store'}})
  }

async function fetchWithTimeout(resource, timeout = 3000) {  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    headers: {
      'X-Horizon-Client': 'altitude-shield-prober'
    },
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}