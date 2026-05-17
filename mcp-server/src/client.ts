/**
 * HTTP client for the MarriageAstro API
 */

const DEFAULT_BASE_URL = 'https://marriage-astro.vercel.app/api/v1';

export async function callApi(endpoint: string, body: Record<string, unknown>): Promise<unknown> {
  const apiKey = process.env.MARRIAGE_ASTRO_API_KEY;
  const baseUrl = process.env.MARRIAGE_ASTRO_BASE_URL || DEFAULT_BASE_URL;

  if (!apiKey) {
    throw new Error(
      'MARRIAGE_ASTRO_API_KEY is not set. Get your key at https://marriage-astro.vercel.app/api-keys'
    );
  }

  const url = `${baseUrl}/${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json() as any;

  if (!response.ok) {
    const message = json?.error || `API error: ${response.status} ${response.statusText}`;
    if (response.status === 403 && json?.upgrade_url) {
      throw new Error(`${message}\nUpgrade at: ${json.upgrade_url}`);
    }
    throw new Error(message);
  }

  return json.data ?? json;
}
