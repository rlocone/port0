'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Thermometer, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  temp?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  description?: string;
  icon?: string;
  city?: string;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/weather');
        if (!res?.ok) {
          throw new Error('Failed to fetch weather');
        }
        const data = await res?.json?.();
        setWeather(data ?? null);
      } catch (err) {
        setError('Unable to load weather');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather?.();
  }, []);

  const getWeatherIcon = (iconCode?: string) => {
    if (!iconCode) return <Sun className="w-12 h-12 text-yellow-400" />;
    
    const code = iconCode?.slice?.(0, 2) ?? '';
    switch (code) {
      case '01': return <Sun className="w-12 h-12 text-yellow-400" />;
      case '02':
      case '03':
      case '04': return <Cloud className="w-12 h-12 text-gray-400" />;
      case '09':
      case '10': return <CloudRain className="w-12 h-12 text-blue-400" />;
      case '13': return <Snowflake className="w-12 h-12 text-cyan-300" />;
      default: return <Cloud className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-6 glow-cyan glass-hover transition-all duration-500"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-cyan-400" />
        <span className="text-sm text-cyan-300 uppercase tracking-widest">
          {weather?.city ?? 'Tallahassee, FL'}
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-gray-400">
          <Cloud className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && weather && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-5xl font-light text-white">
                {Math?.round?.(weather?.temp ?? 0) ?? 0}°F
              </div>
              <p className="text-gray-400 capitalize mt-1">
                {weather?.description ?? 'Unknown'}
              </p>
            </div>
            <div className="animate-float">
              {getWeatherIcon(weather?.icon)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <Thermometer className="w-5 h-5 mx-auto text-orange-400 mb-1" />
              <div className="text-sm text-gray-300">
                {Math?.round?.(weather?.feels_like ?? 0) ?? 0}°F
              </div>
              <div className="text-xs text-gray-500">Feels Like</div>
            </div>
            <div className="text-center">
              <Droplets className="w-5 h-5 mx-auto text-blue-400 mb-1" />
              <div className="text-sm text-gray-300">
                {weather?.humidity ?? 0}%
              </div>
              <div className="text-xs text-gray-500">Humidity</div>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto text-teal-400 mb-1" />
              <div className="text-sm text-gray-300">
                {Math?.round?.(weather?.wind_speed ?? 0) ?? 0} mph
              </div>
              <div className="text-xs text-gray-500">Wind</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
