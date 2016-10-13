declare module 'node-localstorage' {

  export class JSONStorage {
    constructor(...args: any[]);
    getItem(key: any): any;
    setItem(key: any, value: any): any;
    static defaultMaxListeners: number;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
  }
  export class LocalStorage {
    constructor(_location: any, quota: any);
    clear(): any;
    getItem(key: any): any;
    key(n: any): any;
    removeItem(key: any): any;
    setItem(key: any, value: any): any;
    static defaultMaxListeners: number;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
  }
  export class QUOTA_EXCEEDED_ERR {
    constructor(message: any);
    toString(): any;
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
  }
  export namespace JSONStorage {
    class EventEmitter {
      constructor();
      addListener(type: any, listener: any): any;
      emit(type: any, ...args: any[]): any;
      getMaxListeners(): any;
      listenerCount(type: any): any;
      listeners(type: any): any;
      on(type: any, listener: any): any;
      once(type: any, listener: any, ...args: any[]): any;
      removeAllListeners(type: any, ...args: any[]): any;
      removeListener(type: any, listener: any): any;
      setMaxListeners(n: any): any;
      static EventEmitter: any;
      static defaultMaxListeners: number;
      static init(): void;
      static listenerCount(emitter: any, type: any): any;
      static usingDomains: boolean;
    }
  }
  export namespace LocalStorage {
    class EventEmitter {
      constructor();
      addListener(type: any, listener: any): any;
      emit(type: any, ...args: any[]): any;
      getMaxListeners(): any;
      listenerCount(type: any): any;
      listeners(type: any): any;
      on(type: any, listener: any): any;
      once(type: any, listener: any, ...args: any[]): any;
      removeAllListeners(type: any, ...args: any[]): any;
      removeListener(type: any, listener: any): any;
      setMaxListeners(n: any): any;
      static EventEmitter: any;
      static defaultMaxListeners: number;
      static init(): void;
      static listenerCount(emitter: any, type: any): any;
      static usingDomains: boolean;
    }
  }
}