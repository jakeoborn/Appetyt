import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.dimhour.ios',
  appName: 'Dim Hour',
  webDir: 'dist',

  server: {
    iosScheme: 'https',
    allowNavigation: [
      'dimhour.com',
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
    scheme: 'DimHour',
    // Universal Links (for https://dimhour.com links to open the app)
    associatedDomains: ['applinks:dimhour.com']
  }
};

export default config;
