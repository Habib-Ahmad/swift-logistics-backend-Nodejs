declare namespace Express {
  interface Request {
    user: {
      id: string;
    };
  }
  interface Response {
    user: {
      id: string;
    };
  }
}
