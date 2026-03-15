import { boot } from 'quasar/wrappers'
import { APP_UPDATE_MODES, initAppUpdate } from 'src/services/appUpdateService'

const APP_UPDATE_MODE = APP_UPDATE_MODES.FLEXIBLE

export default boot(() => {
  void initAppUpdate({ mode: APP_UPDATE_MODE })
})
