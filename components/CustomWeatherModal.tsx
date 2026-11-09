import React, { useEffect, useState } from 'react';
import { X, Thermometer, Wind, Compass, RotateCcw, Check } from 'lucide-react';
import { useCivilization } from '../contexts/CivilizationContext';
import GlossedTerm from './GlossedTerm';
import { BABYLONIAN_UI_TERMS as BAB } from '../utils/civLabels';
import { WeatherData } from '../types';
import {
  CustomWeatherConfig,
  DEFAULT_CUSTOM_WEATHER,
  SKY_PRESETS,
  compassName,
} from '../utils/customWeather';
import './CustomWeatherModal.css';

function presetBtnMod(active: boolean, isAurora: boolean): string {
  if (active)
    return isAurora
      ? 'custom-weather-modal__preset-btn--active-aurora'
      : 'custom-weather-modal__preset-btn--active';
  return isAurora
    ? 'custom-weather-modal__preset-btn--inactive-aurora'
    : 'custom-weather-modal__preset-btn--inactive';
}

interface CustomWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The custom sky currently in use. */
  config: CustomWeatherConfig;
  /** Called with the new sky when the user applies it. */
  onApply: (config: CustomWeatherConfig) => void;
  /** Live weather, used to seed the custom values. */
  liveWeather?: WeatherData | null;
}

const Slider: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}> = ({ label, icon, value, min, max, step = 1, suffix, onChange }) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className="custom-weather-slider">
    <span className="custom-weather-slider__header">
      <span className="custom-weather-slider__label-group">
        {icon}
        {label}
      </span>
      <span className="custom-weather-slider__value">
        {value}
        {suffix}
      </span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="custom-weather-slider__input"
    />
  </label>
);

/**
 * Lets the user pick a sky (live weather, the aurora borealis, or a preset
 * condition) and set custom temperature and wind values.
 *
 * Reached from the upper-right menu of the mobile layout.
 */
const CustomWeatherModal: React.FC<CustomWeatherModalProps> = ({
  isOpen,
  onClose,
  config,
  onApply,
  liveWeather,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { civilization } = useCivilization();
  const [draft, setDraft] = useState<CustomWeatherConfig>(config);

  // Seed the sliders from the live weather every time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    const seed = liveWeather?.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft({
      ...config,
      temperature:
        config.mode === 'custom'
          ? config.temperature
          : Math.round(seed?.temperature ?? DEFAULT_CUSTOM_WEATHER.temperature),
      windSpeed:
        config.mode === 'custom'
          ? config.windSpeed
          : Math.round(seed?.windSpeed ?? DEFAULT_CUSTOM_WEATHER.windSpeed),
      windDirection:
        config.mode === 'custom'
          ? config.windDirection
          : Math.round(seed?.windDirection ?? DEFAULT_CUSTOM_WEATHER.windDirection),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const isBabylon = civilization === 'babylonia';
  const activePresetId =
    draft.mode === 'live'
      ? 'live'
      : // eslint-disable-next-line sonarjs/no-nested-conditional
        draft.aurora
        ? 'aurora'
        : (SKY_PRESETS.find(p => !p.aurora && p.id !== 'live' && p.code === draft.code)?.id ??
          '');

  const pickPreset = (presetId: string) => {
    const preset = SKY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    if (preset.id === 'live') {
      setDraft(d => ({ ...d, mode: 'live', aurora: false, label: '' }));
      return;
    }
    setDraft(d => ({
      ...d,
      mode: 'custom',
      code: preset.code,
      aurora: !!preset.aurora,
    }));
  };

  const apply = () => {
    onApply(draft);
    onClose();
  };

  const reset = () => {
    onApply({ ...DEFAULT_CUSTOM_WEATHER });
    onClose();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="custom-weather-modal animate-fadeIn"
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose();
      }}
    >
      <div
        role="presentation"
        className="custom-weather-modal__panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="custom-weather-modal__header">
          <div className="custom-weather-modal__header-text">
            {isBabylon ? (
              <GlossedTerm
                term={BAB.sky}
                align="start"
                className="custom-weather-modal__babylon-sky-heading"
                glossClassName="custom-weather-modal__babylon-sky-gloss"
              />
            ) : (
              <h3>Caelum</h3>
            )}
            <p className="custom-weather-modal__subtitle">Cielo personalizado</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="custom-weather-modal__close">
            <X className="custom-weather-modal__close-icon" />
          </button>
        </div>

        {/* Body */}
        <div className="custom-weather-modal__body custom-scrollbar">
          {/* Sky presets */}
          <div>
            <span className="custom-weather-modal__presets-label">
              {isBabylon ? <GlossedTerm term={BAB.sky} align="start" /> : 'Caelum'}
            </span>
            <div className="custom-weather-modal__presets-grid">
              {SKY_PRESETS.map(preset => {
                const active = activePresetId === preset.id;
                const isAurora = !!preset.aurora;
                const btnMod = presetBtnMod(active, isAurora);
                const btnClass = `custom-weather-modal__preset-btn ${btnMod}`;

                return (
                  <button
                    key={preset.id}
                    onClick={() => pickPreset(preset.id)}
                    className={btnClass}
                  >
                    <span>{preset.label}</span>
                    {active && <Check className="custom-weather-modal__check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom values */}
          <div className="custom-weather-modal__values">
            <span className="custom-weather-modal__values-label">Valores</span>

            <Slider
              label="Temperatura"
              icon={<Thermometer />}
              value={draft.temperature}
              min={-40}
              max={50}
              suffix="°C"
              onChange={v => setDraft(d => ({ ...d, temperature: v }))}
            />

            <Slider
              label="Viento"
              icon={<Wind />}
              value={draft.windSpeed}
              min={0}
              max={150}
              suffix=" km/h"
              onChange={v => setDraft(d => ({ ...d, windSpeed: v }))}
            />

            <Slider
              label="Dirección"
              icon={<Compass />}
              value={draft.windDirection}
              min={0}
              max={359}
              suffix={`° ${compassName(draft.windDirection)}`}
              onChange={v => setDraft(d => ({ ...d, windDirection: v }))}
            />

            <label className="custom-weather-modal__text-label">
              <span className="custom-weather-modal__text-label-text">Etiqueta</span>
              <input
                type="text"
                value={draft.label}
                maxLength={28}
                placeholder="Nombre del cielo (opcional)"
                onChange={e => setDraft(d => ({ ...d, label: e.target.value }))}
                className="custom-weather-modal__text-input"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="custom-weather-modal__footer">
          <button onClick={reset} className="custom-weather-modal__reset-btn">
            <RotateCcw className="custom-weather-modal__reset-icon" />
            Tiempo real
          </button>
          <button onClick={apply} className="custom-weather-modal__apply-btn">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomWeatherModal;
