import {Controller} from 'deck.gl';

class DeckController extends Controller{
  constructor(options = {}) {
    // super(MyViewState, options);
    super({
      longitude: 137.1509443,
      latitude: 35.0554637,
      zoom: 18,
      maxZoom: 23,
      pitch: 45
    }, options);
    
    this.events = ['pointermove'];
  }

  handleEvent(event) {
    console.log('event',event)
    if (event.type === 'pointermove') {
      // do something
    } else {
      super.handleEvent(event);
    }
  }
}
export default DeckController;