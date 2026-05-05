/**
 * HTTP client for the MarriageAstro API
 */

const DEFAULT_BASE_URL = 'https://marriageastro.com/api/v1';

export async function callApi(endpoint: string, body: Record<string, unknown>): Promise<unknown> {
  const apiKey = process.env.VEDIC_ASTRO_API_KEY;
  const baseUrl = process.env.VEDIC_ASTRO_BASE_URL || DEFAULT_BASE_URL;

  if (!apiKey) {
    throw new Error(
      'VEDIC_ASTRO_API_KEY is not set. Get your key at https://marriageastro.com/api-keys'
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
