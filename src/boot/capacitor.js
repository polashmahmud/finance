import { boot } from 'quasar/wrappers'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

export default boot(async () => {
  if (!Capacitor.isNativePlatform()) return

  try {
    // Set status bar to not overlay the WebView (show separately)
    await StatusBar.setOverlaysWebView({ overlay: false })
    // Use light style for dark icons on white background
    await StatusBar.setStyle({ style: Style.Light })
    // Set white background to match the app header
    await StatusBar.setBackgroundColor({ color: '#ffffff' })
    // Show the status bar
    await StatusBar.show()
  } catch {
    // StatusBar plugin unavailable (e.g. running in browser)
  }
})
