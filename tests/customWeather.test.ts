import { describe, it, expect } from 'vite-plus/test';
import {
  DEFAULT_CUSTOM_WEATHER,
  CustomWeatherConfig,
  applyCustomWeather,
  toggleAuroraLayer,
} from '../utils/customWeather';

const live: CustomWeatherConfig = { ...DEFAULT_CUSTOM_WEATHER };

describe('toggleAuroraLayer', () => {
  it('turning one layer on from live weather shows the aurora with only that layer', () => {
    const svg = toggleAuroraLayer(live, 'auroraSvg');
    expect(svg).toMatchObject({
      mode: 'custom',
      aurora: true,
      auroraGl: false,
      auroraSvg: true,
    });
    const gl = toggleAuroraLayer(live, 'auroraGl');
    expect(gl).toMatchObject({
      mode: 'custom',
      aurora: true,
      auroraGl: true,
      auroraSvg: false,
    });
  });

  it('both layers can be on at once', () => {
    const both = toggleAuroraLayer(toggleAuroraLayer(live, 'auroraGl'), 'auroraSvg');
    expect(both).toMatchObject({ aurora: true, auroraGl: true, auroraSvg: true });
  });

  it('turning the last layer off returns to live weather and keeps the layer choice', () => {
    const on = toggleAuroraLayer(live, 'auroraSvg');
    const off = toggleAuroraLayer(on, 'auroraSvg');
    expect(off).toMatchObject({
      mode: 'live',
      aurora: false,
      auroraGl: false,
      auroraSvg: true,
    });
  });

  it('turning one of two layers off keeps the aurora on', () => {
    const both = {
      ...live,
      mode: 'custom' as const,
      aurora: true,
      auroraGl: true,
      auroraSvg: true,
    };
    expect(toggleAuroraLayer(both, 'auroraGl')).toMatchObject({
      aurora: true,
      auroraGl: false,
      auroraSvg: true,
    });
  });

  it('keeps a custom label and code when the aurora is already on', () => {
    const on = { ...live, mode: 'custom' as const, aurora: true, code: 3, label: 'Mi cielo' };
    expect(toggleAuroraLayer(on, 'auroraSvg')).toMatchObject({ code: 3, label: 'Mi cielo' });
  });
});

describe('applyCustomWeather', () => {
  it('passes the layer choice through, also for the offline aurora in live mode', () => {
    const offline = { isOffline: true, aurora: true, historical: [], current: {} } as never;
    const out = applyCustomWeather(offline, { ...live, auroraGl: false, auroraSvg: true });
    expect(out?.auroraLayers).toEqual({ gl: false, svg: true });
  });
});
