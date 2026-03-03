import { boot } from 'quasar/wrappers'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

export default boot(async () => {
  if (!Capacitor.isNativePlatform()) return

  try {
    // Status bar যেন WebView-এর উপরে overlap না করে
    await StatusBar.setOverlaysWebView({ overlay: false })
    // Style ডার্ক রাখুন (লাইট ব্যাকগ্রাউন্ডের জন্য আইকন গাঢ় থাকবে)
    await StatusBar.setStyle({ style: Style.Dark })
    // ব্যাকগ্রাউন্ড সাদা রাখুন
    await StatusBar.setBackgroundColor({ color: '#ffffff' })
  } catch (e) {
    console.warn('StatusBar plugin error:', e)
  }
})
