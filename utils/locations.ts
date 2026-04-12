import { MapPin, Navigation, LucideIcon } from 'lucide-react';

export interface LocationItem {
    id: string;
    name: string;
    icon: LucideIcon;
    lat: number | null;
    lng: number | null;
}

export const LOCATIONS: LocationItem[] = [
    { id: 'gps', name: 'Actual (GPS)', icon: Navigation, lat: null, lng: null },
    { id: 'basilea', name: 'Basilea', icon: MapPin, lat: 47.5546368, lng: 7.5532081 },
    { id: 'parla', name: 'Parla', icon: MapPin, lat: 40.2348316, lng: -3.7876793 },
    { id: 'lagartera', name: 'Lagartera', icon: MapPin, lat: 39.9071497, lng: -5.2106728 },
    { id: 'corral', name: 'Corral de Almaguer', icon: MapPin, lat: 39.7608446, lng: -3.1667764 },
    { id: 'reikiavik', name: 'Reikiavik', icon: MapPin, lat: 64.1261865, lng: -21.9350214 },
    { id: 'santodomingo', name: 'Santo Domingo', icon: MapPin, lat: 18.4801874, lng: -70.0292817 },
    { id: 'auckland', name: 'Auckland', icon: MapPin, lat: -36.8318297, lng: 174.3969279 },
    { id: 'taipei', name: 'Taipéi', icon: MapPin, lat: 25.0174467, lng: 121.3415663 },
];
