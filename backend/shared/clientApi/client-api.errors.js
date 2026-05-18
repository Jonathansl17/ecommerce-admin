export class ClientApiError extends Error {
  constructor(message, { code, status, body } = {}) {
    super(message);
    this.name = 'ClientApiError';
    this.code = code;
    this.status = status;
    this.body = body;
  }
}
