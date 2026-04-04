import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

const WeatherIcon = ({ code }: { code: number }) => {
  // WMO Weather interpretation codes
  const isThunderstorm = code >= 95;
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || isThunderstorm;
  const isSnow = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  const isCloudy = (code >= 1 && code <= 3) || isRain || isSnow || isThunderstorm || (code >= 45 && code <= 48);
  const isClear = code === 0;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {isClear && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full bg-brand-green shadow-[0_0_20px_rgba(0,255,0,0.5)]"
        />
      )}

      {isCloudy && (
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 z-10"
        >
          <svg width="56" height="36" viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Back cloud shadow/highlight */}
            <path d="M38.8953 15.0874C37.0187 10.8711 32.8465 8 28 8C21.3726 8 16 13.3726 16 20C16 18.3333 16 17 16 15.6667C16 10.5114 20.178 6.33333 25.3333 6.33333C29.624 6.33333 33.2427 9.22267 34.382 13.2047C35.2533 11.238 37.2187 9.83333 39.5 9.83333C42.4456 9.83333 44.8333 12.2212 44.8333 15.1667C44.8333 15.3352 44.8254 15.5019 44.8101 15.6664C43.856 14.6133 42.4467 13.9167 40.8333 13.9167C39.2587 13.9167 37.845 14.616 36.8953 15.6707C37.845 14.616 38.8953 15.0874 38.8953 15.0874Z" fill="#94a3b8" />
            {/* Main cloud */}
            <path d="M16 20C16 13.3726 21.3726 8 28 8C32.8465 8 37.0187 10.8711 38.8953 15.0874C39.845 14.0326 41.2587 13.3333 42.8333 13.3333C45.7789 13.3333 48.1667 15.7212 48.1667 18.6667C48.1667 18.8352 48.1588 20.0019 48.1435 20.1664C50.8892 21.27 52.8333 23.9767 52.8333 27.1667C52.8333 31.1247 49.6247 34.3333 45.6667 34.3333H16C10.8453 34.3333 6.66667 30.1547 6.66667 25C6.66667 19.8453 10.8453 15.6667 16 15.6667C16 17 16 18.3333 16 20Z" fill="#f8fafc" />
          </svg>
        </motion.div>
      )}

      {isThunderstorm && (
        <motion.div
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className="absolute top-6 left-6 z-20"
        >
          <svg width="16" height="24" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2L2 15H9L8 26L17 13H10L11 2Z" fill="#00FF00" stroke="#00FF00" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}

      {isRain && (
        <div className="absolute top-8 left-0 flex gap-2 w-full justify-center z-0">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 16], opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "linear" }}
              className="w-0.5 h-3 bg-white/60 rounded-full"
            />
          ))}
        </div>
      )}

      {isSnow && (
        <div className="absolute top-8 left-0 flex gap-2 w-full justify-center z-0">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 15], x: [-3, 3, -3], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<{ temp: number, code: number, desc: string } | null>(null);

  useEffect(() => {
    // Fetch real-time weather for Times Square (40.7554, -73.9904)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7554&longitude=-73.9904&current=temperature_2m,weather_code&temperature_unit=fahrenheit')
      .then(res => res.json())
      .then(data => {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        let desc = 'Clear';
        if (code >= 1 && code <= 3) desc = 'Cloudy';
        if (code >= 45 && code <= 48) desc = 'Fog';
        if (code >= 51 && code <= 67) desc = 'Rain';
        if (code >= 71 && code <= 82) desc = 'Snow';
        if (code >= 80 && code <= 82) desc = 'Showers';
        if (code >= 95) desc = 'Thunderstorms';
        setWeather({ temp, code, desc });
      })
      .catch(console.error);
  }, []);

  if (!weather) return null;

  return (
    <div className="flex flex-col items-end">
      <WeatherIcon code={weather.code} />
      <div className="mt-2 text-right">
        <div className="text-3xl font-bold text-white tracking-tighter">{weather.temp}°F</div>
        <div className="text-[10px] text-white/60 font-mono uppercase tracking-widest mt-1">{weather.desc}</div>
      </div>
    </div>
  );
};

export default function FooterMap() {
  return (
    <div className="w-full mb-24">
      {/* Location Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md max-w-md mx-auto md:mx-0 relative"
      >
        <div className="flex justify-between items-start gap-4 mb-6">
          {/* Left Side: Location Info */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green relative flex-shrink-0">
                <MapPin size={24} className="relative z-10" />
                <div className="absolute inset-0 bg-brand-green rounded-full animate-ping opacity-20" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white leading-none mb-1">Location</h3>
                <p className="text-brand-green font-mono text-xs uppercase tracking-widest">Times Square Area</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-white/90 font-mono text-sm uppercase tracking-wider">240 West 40th Street</p>
              <p className="text-white/90 font-mono text-sm uppercase tracking-wider">New York, NY 10018</p>
            </div>
          </div>

          {/* Right Side: Weather */}
          <div className="flex-shrink-0">
            <WeatherWidget />
          </div>
        </div>

        <a 
          href="https://maps.google.com/?q=240+West+40th+Street,+New+York,+NY+10018" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-brand-green transition-colors flex items-center justify-center gap-2"
        >
          Get Directions
        </a>
      </motion.div>
    </div>
  );
}
