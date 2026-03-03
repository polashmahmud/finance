import { boot } from 'quasar/wrappers'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

export default boot(async () => {
  if (!Capacitor.isNativePlatform()) return

  try {
    // Prevent the status bar from overlapping the WebView
    await StatusBar.setOverlaysWebView({ overlay: false })
    // Dark style so icons are visible on a light background
    await StatusBar.setStyle({ style: Style.Dark })
    // White background to match the app header
    await StatusBar.setBackgroundColor({ color: '#ffffff' })
  } catch {
    // StatusBar plugin unavailable (e.g. running in browser)
  }
})
