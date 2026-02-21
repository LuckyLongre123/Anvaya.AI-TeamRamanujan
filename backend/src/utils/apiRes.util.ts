export class apiRes {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message = "success", success = true) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
}

export class apiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];

  constructor(statusCode = 500, message = "Something went wrong", errors: any[] = [], stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor as any);
    }
  }
}

const Api = {
  success(res: any, data: any = null, message = "success", statusCode = 200) {
    const payload = new apiRes(statusCode, data, message, true);
    return res.status(statusCode).json(payload);
  },

  error(res: any, error: any = null, message = "error", statusCode = 500) {
    let data: any = null;

    if (error instanceof apiError) {
      data = error.data;
      statusCode = error.statusCode || statusCode;
      message = error.message || message;
    } else if (error) {
      data = { message: error.message || error };
    }

    const payload = new apiRes(statusCode, data, message, false);
    return res.status(statusCode).json(payload);
  },
};

export default Api;
