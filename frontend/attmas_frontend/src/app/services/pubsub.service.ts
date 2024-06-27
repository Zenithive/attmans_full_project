// pubsub.ts

interface EventsType {
  [key: string]: Array<CallableFunction>;
}

class PubSub {
  private events: EventsType;

  constructor() {
    this.events = {};
  }

  public subscribe(event: string, callback: CallableFunction) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return { unsubscribe: () => this.unsubscribe(event, callback) };
  }

  public unsubscribe(event: string, callback: CallableFunction) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  public publish(event: string, data = {}) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}

const pubsub = new PubSub();
export { pubsub, PubSub }; // Exporting pubsub instance and PubSub class for usage

