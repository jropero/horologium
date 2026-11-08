import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Navigation } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { useCivilization } from '../contexts/CivilizationContext';
import GlossedTerm from './GlossedTerm';
import { BABYLONIAN_UI_TERMS as BAB } from '../utils/civLabels';
import './Controls.css';

interface ControlsProps {
  latitude: number;
  longitude: number;
  onUpdateLocation: (lat: number, lng: number) => void;
  onRefreshTime: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  latitude,
  longitude,
  onUpdateLocation,
  onRefreshTime,
}) => {
  const { civilization, labels } = useCivilization();
  const [latInput, setLatInput] = useState(latitude.toString());
  const [lngInput, setLngInput] = useState(longitude.toString());

  // Sync controlled inputs when props change (geolocation / localStorage restore)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLatInput(latitude.toString());
    setLngInput(longitude.toString());
  }, [latitude, longitude]);

  const handleManualUpdate = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      onUpdateLocation(lat, lng);
    }
  };

  const handleGeolocation = async () => {
    try {
      // Pedimos la ubicación. Esto abrirá el pop-up de permisos nativo automáticamente.
      // Pedimos ubicación con caché y más tiempo de espera
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 30000, // Le damos 30 segundos máximo para pensar
        maximumAge: 3600000, // Puede usar una ubicación de hace 1 hora (instantáneo)
      });

      setLatInput(position.coords.latitude.toFixed(4));
      setLngInput(position.coords.longitude.toFixed(4));
      onUpdateLocation(position.coords.latitude, position.coords.longitude);
    } catch (error: any) {
      alert('Locus deprehendi non potuit: ' + error.message);
    }
  };

  return (
    <div className="controls animate-fadeIn">
      <div className="controls-card">
        {/* Decorative background hatch */}
        <div className="controls-hatch woodcut-hatch"></div>

        {/* Header decoration */}
        <div className="controls-header">
          <div className="controls-header-icon">
            <RefreshCw className="controls-header-refresh" />
          </div>
          <h3 className="controls-title">{labels.controlsTitle}</h3>
          <div className="controls-divider"></div>
        </div>

        <div className="controls-fields">
          <div className="controls-grid">
            <div className="controls-field">
              <label className="controls-label">
                <MapPin className="controls-label-pin" />
                {civilization === 'babylonia' ? (
                  <GlossedTerm term={BAB.latitude} align="start" className="controls-gloss" />
                ) : (
                  'Latitudo'
                )}
              </label>
              <input
                type="text"
                value={latInput}
                onChange={e => setLatInput(e.target.value)}
                className="controls-input"
              />
            </div>
            <div className="controls-field">
              <label className="controls-label">
                <MapPin className="controls-label-pin" />
                {civilization === 'babylonia' ? (
                  <GlossedTerm term={BAB.longitude} align="start" className="controls-gloss" />
                ) : (
                  'Longitudo'
                )}
              </label>
              <input
                type="text"
                value={lngInput}
                onChange={e => setLngInput(e.target.value)}
                className="controls-input"
              />
            </div>
          </div>
        </div>

        <div className="controls-buttons">
          <button onClick={handleManualUpdate} className="controls-btn-compute">
            <RefreshCw className="controls-btn-compute-icon" />
            {labels.computeBtn}
          </button>

          <button onClick={handleGeolocation} className="controls-btn-geo">
            <Navigation className="controls-btn-geo-icon" />
            {labels.findMeBtn}
          </button>
        </div>

        <div className="controls-footer">
          <p className="controls-footer-text">{labels.controlsFooter}</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
