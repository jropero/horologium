import { WeatherCondition, WeatherData, WeatherSnapshot } from '../types';
import { buildWeatherSnapshot } from './weather';

/**
 * Custom sky ("caelum") chosen by the user from the mobile menu.
 *
 * The app normally shows the live weather from Open-Meteo. From the upper-right
 * menu the user can override it with a preset sky (including the aurora
 * borealis) and with custom temperature / wind values.
 */

export const CUSTOM_WEATHER_KEY = 'horologiumCustomWeather';

export interface CustomWeatherConfig {
  /** 'live' = use the API weather; 'custom' = use the values below. */
  mode: 'live' | 'custom';
  /** WMO weather code of the chosen sky. */
  code: number;
  /** Force the aurora borealis sky (replaces the weather effects). */
  aurora: boolean;
  /**
   * Which aurora renderers draw it: the WebGL shader (`utils/auroraGl.ts`) and/or
   * the SVG curtains (`components/AuroraSvg.tsx`). Also used for the offline
   * aurora. At least one is always true; the menu keeps the last choice when the
   * aurora is switched off.
   */
  auroraGl: boolean;
  auroraSvg: boolean;
  /** Temperature in °C. */
  temperature: number;
  /** Wind speed in km/h. */
  windSpeed: number;
  /** Wind direction in degrees (0 = north). */
  windDirection: number;
  /** Optional custom label, shown instead of the preset name. */
  label: string;
}

export const DEFAULT_CUSTOM_WEATHER: CustomWeatherConfig = {
  mode: 'live',
  code: 0,
  aurora: false,
  auroraGl: true,
  auroraSvg: false,
  temperature: 15,
  windSpeed: 5,
  windDirection: 0,
  label: '',
};

export interface SkyPreset {
  id: string;
  label: string;
  /** WMO weather code. */
  code: number;
  /** This preset paints the aurora borealis instead of the weather effects. */
  aurora?: boolean;
  condition: WeatherCondition;
}

/** The skies offered in the custom-weather modal. */
export const SKY_PRESETS: SkyPreset[] = [
  { id: 'live', label: 'Tiempo real', code: 0, condition: 'clear' },
  { id: 'aurora', label: 'Aurora borealis', code: 0, aurora: true, condition: 'clear' },
  { id: 'clear', label: 'Despejado', code: 0, condition: 'clear' },
  { id: 'partly-cloudy', label: 'Parcialmente nublado', code: 2, condition: 'partly-cloudy' },
  { id: 'cloudy', label: 'Nublado', code: 3, condition: 'cloudy' },
  { id: 'fog', label: 'Niebla', code: 45, condition: 'fog' },
  { id: 'drizzle', label: 'Llovizna', code: 51, condition: 'rain' },
  { id: 'rain', label: 'Lluvia', code: 61, condition: 'rain' },
  { id: 'rain-heavy', label: 'Lluvia intensa', code: 65, condition: 'rain' },
  { id: 'storm', label: 'Tormenta', code: 95, condition: 'storm' },
  { id: 'snow', label: 'Nieve', code: 73, condition: 'snow' },
];

/**
 * Per-civilization wording for the aurora. There is no attested Egyptian term
 * for the northern lights, so it keeps the Latin one (like "Nix" for snow).
 */
export const AURORA_DESCRIPTIONS = {
  latin: 'Aurora Borealis',
  greek: 'Αὐγούρα Βορεία',
  egyptian: 'Aurora Borealis',
  chinese: '極光 Jíguāng',
};

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

/** Eight-point compass label for a bearing in degrees. */
export const compassName = (degrees: number): string => {
  const normalized = ((degrees % 360) + 360) % 360;
  return COMPASS[Math.round(normalized / 45) % 8];
};

/** Reads the stored custom sky; falls back to the live weather when unreadable. */
export const loadCustomWeather = (): CustomWeatherConfig => {
  try {
    const raw = localStorage.getItem(CUSTOM_WEATHER_KEY);
    if (!raw) return { ...DEFAULT_CUSTOM_WEATHER };
    const parsed = JSON.parse(raw);
    const num = (value: unknown, fallback: number) =>
      typeof value === 'number' && isFinite(value) ? value : fallback;
    const bool = (value: unknown, fallback: boolean) =>
      typeof value === 'boolean' ? value : fallback;
    let auroraGl = bool(parsed?.auroraGl, DEFAULT_CUSTOM_WEATHER.auroraGl);
    const auroraSvg = bool(parsed?.auroraSvg, DEFAULT_CUSTOM_WEATHER.auroraSvg);
    if (!auroraGl && !auroraSvg) auroraGl = true;
    return {
      mode: parsed?.mode === 'custom' ? 'custom' : 'live',
      code: num(parsed?.code, DEFAULT_CUSTOM_WEATHER.code),
      aurora: !!parsed?.aurora,
      auroraGl,
      auroraSvg,
      temperature: num(parsed?.temperature, DEFAULT_CUSTOM_WEATHER.temperature),
      windSpeed: num(parsed?.windSpeed, DEFAULT_CUSTOM_WEATHER.windSpeed),
      windDirection: num(parsed?.windDirection, DEFAULT_CUSTOM_WEATHER.windDirection),
      label: typeof parsed?.label === 'string' ? parsed.label : '',
    };
  } catch {
    return { ...DEFAULT_CUSTOM_WEATHER };
  }
};

/** Persists the custom sky so it survives a reload. */
export const saveCustomWeather = (config: CustomWeatherConfig): void => {
  try {
    localStorage.setItem(CUSTOM_WEATHER_KEY, JSON.stringify(config));
  } catch {
    // Private browsing / storage full: the sky just won't be remembered.
  }
};

export type AuroraLayer = 'auroraGl' | 'auroraSvg';

/**
 * Menu toggle for one aurora renderer. A layer counts as on only while the
 * aurora sky is shown. Turning the first layer on switches the sky to the
 * aurora; turning the last one off goes back to the live weather and keeps the
 * previous layer choice (for the offline aurora and the next time it is on).
 */
export const toggleAuroraLayer = (
  config: CustomWeatherConfig,
  layer: AuroraLayer,
): CustomWeatherConfig => {
  const on = {
    auroraGl: config.aurora && config.auroraGl,
    auroraSvg: config.aurora && config.auroraSvg,
  };
  on[layer] = !on[layer];
  if (!on.auroraGl && !on.auroraSvg)
    return { ...config, mode: 'live', aurora: false, label: '' };
  if (config.aurora) return { ...config, ...on };
  return { ...config, ...on, mode: 'custom', aurora: true, code: 0, label: '' };
};

/** The name shown in the mobile menu for the current sky. */
export const customWeatherLabel = (config: CustomWeatherConfig): string => {
  if (!config || config.mode === 'live') return 'Tiempo real';
  const custom = config.label.trim();
  if (custom) return custom;
  if (config.aurora) return 'Aurora borealis';
  const preset = SKY_PRESETS.find(p => !p.aurora && p.id !== 'live' && p.code === config.code);
  return preset?.label ?? 'Personalizado';
};

/**
 * Builds the effective weather shown by the app.
 *
 * In 'live' mode the fetched weather is returned untouched. In 'custom' mode a
 * synthetic snapshot is built from the chosen sky and the custom values; the
 * historical comparison years are kept.
 */
export const applyCustomWeather = (
  base: WeatherData | null,
  config: CustomWeatherConfig | null,
): WeatherData | null => {
  const auroraLayers = config
    ? { gl: config.auroraGl, svg: config.auroraSvg }
    : { gl: true, svg: false };
  if (!config || config.mode === 'live') {
    if (!base) return null;
    return { ...base, aurora: !!base.aurora, auroraLayers };
  }

  const source = base?.current;
  const snapshot = buildWeatherSnapshot({
    temperature: config.temperature,
    code: config.code,
    windSpeed: config.windSpeed,
    windGusts: 0,
    windDirection: config.windDirection,
    surfacePressure: source?.surfacePressure ?? 1013,
    yearLabel: source?.yearLabel ?? 'Hodie',
  });

  const customLabel = config.label.trim();
  let current: WeatherSnapshot = snapshot;
  if (config.aurora) {
    current = {
      ...snapshot,
      condition: 'clear',
      description: AURORA_DESCRIPTIONS.latin,
      greekDescription: AURORA_DESCRIPTIONS.greek,
      egyptianDescription: AURORA_DESCRIPTIONS.egyptian,
      chineseDescription: AURORA_DESCRIPTIONS.chinese,
    };
  } else if (customLabel) {
    // A custom label replaces the weather wording in every civilization.
    current = {
      ...snapshot,
      description: customLabel,
      greekDescription: customLabel,
      egyptianDescription: customLabel,
      chineseDescription: customLabel,
    };
  }

  return {
    ...(base ?? { current, historical: [] }),
    current,
    aurora: config.aurora,
    auroraLayers,
  };
};
