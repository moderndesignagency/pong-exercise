import config from '../../config'
import CustomWebSocket from '../../models/CustomWebSocket'

const websocket = new CustomWebSocket(config.wsURL, {
  maxAttemps: 50,
  timeout: 5000,
  autoOpen: false,
})
export default websocket
