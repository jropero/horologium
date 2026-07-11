import { MapPin, Navigation, LucideIcon } from 'lucide-react';

export interface LocationItem {
    id: string;
    name: string;
    icon: LucideIcon;
    lat: number | null;
    lng: number | null;
    timezone?: string;
}

export function getTimezoneForLocation(lat: number, lng: number): string | undefined {
  const match = LOCATIONS.find(
    loc => loc.lat !== null && loc.lng !== null
      && Math.abs(lat - loc.lat) < 0.001
      && Math.abs(lng - loc.lng) < 0.001
  );
  return match?.timezone;
}

export const LOCATIONS: LocationItem[] = [
    { id: 'gps', name: 'Actual (GPS)', icon: Navigation, lat: null, lng: null },
    { id: 'basilea', name: 'Basilea', icon: MapPin, lat: 47.5546368, lng: 7.5532081, timezone: 'Europe/Zurich' },
    { id: 'parla', name: 'Parla', icon: MapPin, lat: 40.2348316, lng: -3.7876793, timezone: 'Europe/Madrid' },
    { id: 'lagartera', name: 'Lagartera', icon: MapPin, lat: 39.9071497, lng: -5.2106728, timezone: 'Europe/Madrid' },
    { id: 'corral', name: 'Corral de Almaguer', icon: MapPin, lat: 39.7608446, lng: -3.1667764, timezone: 'Europe/Madrid' },
    { id: 'reikiavik', name: 'Reikiavik', icon: MapPin, lat: 64.1261865, lng: -21.9350214, timezone: 'Atlantic/Reykjavik' },
    { id: 'santodomingo', name: 'Santo Domingo', icon: MapPin, lat: 18.4801874, lng: -70.0292817, timezone: 'America/Santo_Domingo' },
    { id: 'auckland', name: 'Auckland', icon: MapPin, lat: -36.8318297, lng: 174.3969279, timezone: 'Pacific/Auckland' },
    { id: 'taipei', name: 'Taipéi', icon: MapPin, lat: 25.0174467, lng: 121.3415663, timezone: 'Asia/Taipei' },
];
