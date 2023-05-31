function noop() {}

export type CustomWebSocketOptions = {
  maxAttempts?: number
  timeout?: number
  autoOpen?: boolean
  protocols?: string | string[]

  onopen?: (e: Event) => any
  onclose?: (e: Event) => any
  onreconnect?: (e: Event) => any
  onmessage?: (e: MessageEvent) => any
  onerror?: (e: Event) => any
}

export default class CustomWebSocket {
  private url: string
  private attempts: number
  private timerId?: number | ReturnType<typeof setTimeout>
  private maxAttempts: number
  private timeout: number
  private autoOpen: boolean
  private protocols?: string | string[]
  private ws?: WebSocket

  public onopen: (e: Event) => any
  public onclose: (e: Event) => any
  public onreconnect: (e: Event) => any
  public onmessage: (e: MessageEvent) => any
  public onerror: (e: Event) => any

  constructor(url: string, options: CustomWebSocketOptions) {
    this.url = url
    this.attempts = 0
    this.timerId = 1
    this.maxAttempts = options.maxAttempts || 100
    this.timeout = options.timeout || 5e3
    this.autoOpen = options.autoOpen ?? false
    this.protocols = options.protocols

    // Hooks
    this.onopen = options.onopen ?? noop
    this.onclose = options.onclose ?? noop
    this.onreconnect = options.onreconnect ?? noop
    this.onmessage = options.onmessage ?? noop
    this.onerror = options.onerror ?? noop

    if (this.autoOpen) {
      this.open()
    }
  }

  open() {
    const ws = new WebSocket(this.url, this.protocols)

    ws.onmessage = this.onmessage
    ws.onopen = e => {
      this.onopen(e)
      this.attempts = 0
    }
    ws.onclose = e => {
      if (e.code !== 1000 && e.code !== 1001 && e.code !== 1005) {
        this.reconnect(e)
      }
      this.onclose(e)
    }
    ws.onerror = e => {
      e && (e as any).code === 'ECONNREFUSED' ? this.reconnect(e) : this.onerror(e)
    }
    this.ws = ws
  }

  reconnect(e: Event) {
    if (this.timerId && ++this.attempts < this.maxAttempts) {
      this.timerId = setTimeout(() => {
        this.onreconnect(e)
        this.open()
      }, this.timeout)
    }
  }

  close(code?: number, reason?: any) {
    this.timerId = undefined
    clearTimeout(this.timerId)
    this.ws?.close(code, reason)
  }

  send(message: any) {
    this.ws?.send(message)
  }
}
