import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.appetyt.ios',
  appName: 'Appetyt',
  webDir: 'dist',

  server: {
    iosScheme: 'https',
    allowNavigation: [
      'appetyt.app',
      'cdn.jsdelivr.net',
      '*.supabase.co',
      '*.tile.openstreetmap.org',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ]
  },

  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#0a0d14',
      overlaysWebView: false
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0d14',
      showSpinner: false,
      launchAutoHide: true
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK'
    }
  },

  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0a0d14',
    preferredContentMode: 'mobile',
    scheme: 'Appetyt'
  }
};

export default config;
