import Tracker from './Tracker'

export default class BrowserTracker extends Tracker {
  requestTo({url} = {}) {
    const img = new Image()
    img.src = url
  } 
}
