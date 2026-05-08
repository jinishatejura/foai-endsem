/**
 * Calculate the distance between two geographic coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1 (degrees)
 * @param {number} lon1 - Longitude of point 1 (degrees)
 * @param {number} lat2 - Latitude of point 2 (degrees)
 * @param {number} lon2 - Longitude of point 2 (degrees)
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate speed in km/h given two positions and timestamps.
 * @param {Object} pos1 - { latitude, longitude, timestamp }
 * @param {Object} pos2 - { latitude, longitude, timestamp }
 * @returns {number} Speed in km/h
 */
export function calculateSpeed(pos1, pos2) {
  const distance = haversineDistance(
    pos1.latitude, pos1.longitude,
    pos2.latitude, pos2.longitude
  );

  const timeDiffHours = (pos2.timestamp - pos1.timestamp) / 3600;

  if (timeDiffHours <= 0) return 0;

  return distance / timeDiffHours;
}
