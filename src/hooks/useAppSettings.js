// D:\workspace\perfumes-wala\perfume-wala-web\src\hooks\useAppSettings.js
'use client';
import { useState, useEffect } from 'react';
import * as api from 'src/services';

export function useAppSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.getSetting();
        // console.log('Settings fetched:', response.data); // Debug full response
        if (response.data && response.data.length > 0) {
          setSettings(response.data[0]);
          // console.log('Settings set:', response.data[0]); // Confirm settings
        } else {
          console.log('No settings data found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
