function noop() {}

export default class CustomWebSocket {
  constructor(url, options) {
    this.url = url
    this.attempts = 0
    this.timerId = 1
    this.maxAttempts = options.maxAttempts || 100
    this.timeout = options.timeout || 5e3
    this.autoOpen = options.autoOpen
    this.protocols = options.protocols

    // Hooks
    this.onopen = options.onopen || noop
    this.onclose = options.onclose || noop
    this.reconnect = options.onreconnect || noop
    this.onmessage = options.onmessage || noop
    this.onerror = options.onerror || noop

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
      e && e.code === 'ECONNREFUSED' ? this.reconnect(e) : this.onerror(e)
    }
		this.ws = ws
  }

  reconnect(e) {
    this.attempts += 1
    if (this.timerId && this.attempts < this.maxAttempts) {
      this.timerId = setTimeout(() => {
        this.onreconnect(e)
        this.open()
      }, this.timeout)
    }
  }

	close(code, reason) {
		this.timerId = clearTimeout(this.timerId)
		this.ws.close(code, reason)
	}
}
