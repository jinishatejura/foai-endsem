import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateSpeed } from '../utils/haversine';
import { reverseGeocode } from '../utils/geocode';

const isDev = window.location.hostname === 'localhost';
const ISS_API = isDev ? 'http://api.open-notify.org/iss-now.json' : '/api/iss';
const ASTROS_API = isDev ? 'http://api.open-notify.org/astros.json' : '/api/astros';
const MAX_POSITIONS = 15;
const MAX_SPEEDS = 30;
const POLL_INTERVAL = 15000; // 15 seconds

export function useISS() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [locationName, setLocationName] = useState('Locating...');
  const [astronauts, setAstronauts] = useState([]);
  const [astronautCount, setAstronautCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastPositionRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchISSPosition = useCallback(async () => {
    try {
      const response = await fetch(ISS_API);
      if (!response.ok) throw new Error('Failed to fetch ISS position');

      const data = await response.json();

      if (data.message === 'success') {
        const newPosition = {
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          timestamp: data.timestamp,
        };

        // Calculate speed if we have a previous position
        if (lastPositionRef.current) {
          const speed = calculateSpeed(lastPositionRef.current, newPosition);
          // ISS travels at ~27,600 km/h, filter unrealistic values
          if (speed > 0 && speed < 50000) {
            setCurrentSpeed(speed);
            setSpeeds((prev) => {
              const newSpeeds = [...prev, { speed, time: new Date(newPosition.timestamp * 1000).toLocaleTimeString() }];
              return newSpeeds.slice(-MAX_SPEEDS);
            });
          }
        }

        lastPositionRef.current = newPosition;
        setCurrentPosition(newPosition);
        setPositions((prev) => {
          const newPositions = [...prev, newPosition];
          return newPositions.slice(-MAX_POSITIONS);
        });

        // Reverse geocode (async, don't block)
        reverseGeocode(newPosition.latitude, newPosition.longitude)
          .then(setLocationName)
          .catch(() => setLocationName('Unknown'));

        setError(null);
      }
    } catch (err) {
      console.error('ISS fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const response = await fetch(ASTROS_API);
      if (!response.ok) throw new Error('Failed to fetch astronaut data');

      const data = await response.json();

      if (data.message === 'success') {
        setAstronauts(data.people);
        setAstronautCount(data.number);
      }
    } catch (err) {
      console.error('Astronaut fetch error:', err);
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchISSPosition();
    fetchAstronauts();
  }, [fetchISSPosition, fetchAstronauts]);

  useEffect(() => {
    fetchISSPosition();
    fetchAstronauts();

    intervalRef.current = setInterval(fetchISSPosition, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchISSPosition, fetchAstronauts]);

  return {
    currentPosition,
    positions,
    speeds,
    currentSpeed,
    locationName,
    astronauts,
    astronautCount,
    loading,
    error,
    refresh,
  };
}
