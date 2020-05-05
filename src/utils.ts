import jwt from 'jsonwebtoken';

export const APP_SECRET = 'hello_world';

export const getVerified = context => {
  const authHeader: string = context.req.get('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const isAuth = jwt.verify(token, APP_SECRET);
    return isAuth;
  }
  throw new Error('Not Authenticated');
};
