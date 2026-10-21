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
    <label className="block">
        <span className="flex items-center justify-between text-xs uppercase tracking-widest text-gold-dim/80 mb-1">
            <span className="flex items-center gap-1.5">{icon}{label}</span>
            <span className="font-bold text-parchment normal-case tracking-normal">
                {value}{suffix}
            </span>
        </span>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-full accent-gold-leaf cursor-pointer"
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
}) => {
    const { civilization } = useCivilization();
    const [draft, setDraft] = useState<CustomWeatherConfig>(config);

    // Seed the sliders from the live weather every time the modal opens.
    useEffect(() => {
        if (!isOpen) return;
        const seed = liveWeather?.current;
        setDraft({
            ...config,
            temperature: config.mode === 'custom'
                ? config.temperature
                : Math.round(seed?.temperature ?? DEFAULT_CUSTOM_WEATHER.temperature),
            windSpeed: config.mode === 'custom'
                ? config.windSpeed
                : Math.round(seed?.windSpeed ?? DEFAULT_CUSTOM_WEATHER.windSpeed),
            windDirection: config.mode === 'custom'
                ? config.windDirection
                : Math.round(seed?.windDirection ?? DEFAULT_CUSTOM_WEATHER.windDirection),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    const isBabylon = civilization === 'babylonia';
    const activePresetId = draft.mode === 'live'
        ? 'live'
        : draft.aurora
            ? 'aurora'
            : SKY_PRESETS.find(p => !p.aurora && p.id !== 'live' && p.code === draft.code)?.id ?? '';

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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-ink border-2 border-gold-dim/40 rounded-xl shadow-2xl w-full max-w-sm max-h-[88vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gold-dim/30 bg-ink/95">
                    <div className="min-w-0">
                        {isBabylon ? (
                            <GlossedTerm
                                term={BAB.sky}
                                align="start"
                                className="font-serif text-sm uppercase tracking-[0.25em] text-gold-leaf font-bold"
                                glossClassName="text-gold-dim/70"
                            />
                        ) : (
                            <h3 className="font-serif text-sm uppercase tracking-[0.3em] text-gold-leaf font-bold">
                                Caelum
                            </h3>
                        )}
                        <p className="text-xs text-stone-400 mt-0.5">Cielo personalizado</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="text-parchment/70 hover:text-roman-red transition-colors p-1 rounded-full shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto custom-scrollbar px-4 py-3 space-y-4">
                    {/* Sky presets */}
                    <div>
                        <span className="block font-serif text-xs uppercase tracking-[0.25em] text-gold-dim/70 mb-2">
                            {isBabylon ? <GlossedTerm term={BAB.sky} align="start" /> : 'Caelum'}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            {SKY_PRESETS.map(preset => {
                                const active = activePresetId === preset.id;
                                const isAurora = !!preset.aurora;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => pickPreset(preset.id)}
                                        className={`w-full text-left px-2.5 py-2 rounded-lg font-serif text-xs uppercase tracking-widest transition-all border flex items-center justify-between gap-1
                                            ${active
                                                ? isAurora
                                                    ? 'bg-emerald-400/20 border-emerald-300 text-emerald-200 font-bold'
                                                    : 'bg-gold-leaf text-ink border-gold-leaf font-bold'
                                                : isAurora
                                                    ? 'text-emerald-300/90 border-emerald-500/30 hover:bg-emerald-400/10 hover:border-emerald-400/60'
                                                    : 'text-parchment/80 border-gold-dim/20 hover:bg-gold-leaf/10 hover:border-gold-dim/50'
                                            }`}
                                    >
                                        <span className="truncate">{preset.label}</span>
                                        {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom values */}
                    <div className="space-y-3 pt-1 border-t border-gold-dim/15">
                        <span className="block font-serif text-xs uppercase tracking-[0.25em] text-gold-dim/70">
                            Valores
                        </span>

                        <Slider
                            label="Temperatura"
                            icon={<Thermometer className="w-3.5 h-3.5" />}
                            value={draft.temperature}
                            min={-40}
                            max={50}
                            suffix="°C"
                            onChange={v => setDraft(d => ({ ...d, temperature: v }))}
                        />

                        <Slider
                            label="Viento"
                            icon={<Wind className="w-3.5 h-3.5" />}
                            value={draft.windSpeed}
                            min={0}
                            max={150}
                            suffix=" km/h"
                            onChange={v => setDraft(d => ({ ...d, windSpeed: v }))}
                        />

                        <Slider
                            label="Dirección"
                            icon={<Compass className="w-3.5 h-3.5" />}
                            value={draft.windDirection}
                            min={0}
                            max={359}
                            suffix={`° ${compassName(draft.windDirection)}`}
                            onChange={v => setDraft(d => ({ ...d, windDirection: v }))}
                        />

                        <label className="block">
                            <span className="block text-xs uppercase tracking-widest text-gold-dim/80 mb-1">
                                Etiqueta
                            </span>
                            <input
                                type="text"
                                value={draft.label}
                                maxLength={28}
                                placeholder="Nombre del cielo (opcional)"
                                onChange={e => setDraft(d => ({ ...d, label: e.target.value }))}
                                className="w-full bg-ink/70 border border-gold-dim/25 rounded-lg px-3 py-2 font-serif text-xs text-parchment placeholder:text-stone-500 focus:outline-none focus:border-gold-leaf/60"
                            />
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-gold-dim/30 bg-ink/95">
                    <button
                        onClick={reset}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-serif text-xs uppercase tracking-widest text-parchment/70 border border-gold-dim/25 hover:bg-gold-leaf/10 hover:border-gold-dim/50 transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Tiempo real
                    </button>
                    <button
                        onClick={apply}
                        className="flex-1 px-3 py-2 rounded-lg font-serif text-xs uppercase tracking-widest bg-gold-leaf text-ink border border-gold-leaf font-bold hover:bg-gold-dim transition-colors"
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomWeatherModal;
