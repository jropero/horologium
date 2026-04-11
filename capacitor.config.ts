import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.horologium.app',
  appName: 'Horologium Romanum',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1a1a1a", // El color oscuro de la madera
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    }
  },
};

export default config;