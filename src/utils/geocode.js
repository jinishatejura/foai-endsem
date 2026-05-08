/**
 * Reverse geocode a lat/lon to get the nearest place name.
 * Uses OpenStreetMap Nominatim API (free, no key required).
 * Rate limited to 1 request per second.
 */

let lastRequestTime = 0;

export async function reverseGeocode(latitude, longitude) {
  // Rate limit: wait at least 1.5s between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 1500) {
    await new Promise((resolve) => setTimeout(resolve, 1500 - timeSinceLastRequest));
  }

  try {
    lastRequestTime = Date.now();
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=6&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ISS-Dashboard-Student-Project/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    if (data.address) {
      const { city, town, village, state, country, county } = data.address;
      const placeName = city || town || village || county || state || country;
      const region = state || country || '';

      if (placeName && region && placeName !== region) {
        return `${placeName}, ${region}`;
      }
      return placeName || data.display_name || 'Unknown Location';
    }

    // If over ocean, Nominatim might return limited data
    if (data.display_name) {
      return data.display_name;
    }

    return getOceanName(latitude, longitude);
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return getOceanName(latitude, longitude);
  }
}

/**
 * Fallback: estimate ocean name based on coordinates
 */
function getOceanName(lat, lon) {
  if (lat > 60) return 'Arctic Ocean';
  if (lat < -60) return 'Southern Ocean';

  if (lon > 20 && lon < 146 && lat > -50 && lat < 30) return 'Indian Ocean';
  if ((lon > 100 || lon < -68) && lat > -60 && lat < 60) {
    if (lon > 100 || lon < -100) return 'Pacific Ocean';
  }
  if (lon > -80 && lon < 20 && lat > -60 && lat < 60) return 'Atlantic Ocean';

  return 'Over Ocean';
}
