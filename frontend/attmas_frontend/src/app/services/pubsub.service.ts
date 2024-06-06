interface EventsType{
    [key:string]: Array<CallableFunction>
}
class PubSub {
    events: EventsType;
    constructor() {
      this.events = {};
    }
  
    subscribe(event: string, callback: CallableFunction) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    }
  
    unsubscribe(event: string, callback: CallableFunction) {
      if (!this.events[event]) return;
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  
    publish(event: string, data = {}) {
      if (!this.events[event]) return;
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  const pubsub = new PubSub();
  export default pubsub;
  