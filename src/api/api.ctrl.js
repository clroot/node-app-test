import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const register = async (ctx) => {
  const { username, password } = ctx.request.body;

  //validate parameter
  if (!username || !password) {
    ctx.status = httpStatus.BAD_REQUEST;
    return;
  }

  try {
    //check duplication
    const check = await User.findOne({ username });
    if (check) {
      ctx.status = httpStatus.CONFLICT;
      return;
    }

    //register user
    const user = new User({ username });
    await user.setPassword(password);

    //set access_token and return user object
    ctx.status = httpStatus.CREATED;
    ctx.cookies.set('access_token', user.generateToken(), {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    ctx.body = user.serialize();
  } catch (error) {
    ctx.throw(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  //validate parameter
  if (!username || !password) {
    ctx.status = httpStatus.BAD_REQUEST;
    return;
  }

  try {
    //find user by username
    const user = await User.findOne({ username });
    if (!user) {
      ctx.status = httpStatus.NOT_FOUND;
      return;
    }

    //compare password
    const isCorrectPassword = await user.checkPassword(password);
    if (!isCorrectPassword) {
      ctx.status = httpStatus.UNAUTHORIZED;
      return;
    }

    //set access_token and return user object
    ctx.cookies.set('access_token', user.generateToken(), {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    ctx.body = user.serialize();
  } catch (error) {
    ctx.throw(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

export const logout = (ctx) => {
  //remove access_token
  ctx.cookies.set('access_token');
  ctx.status = httpStatus.NO_CONTENT;
};

export const check = async (ctx) => {
  //get access_token
  const token = ctx.cookies.get('access_token');
  if (!token) {
    ctx.status = httpStatus.UNAUTHORIZED;
    return;
  }

  try {
    //decode jwt token
    const decoded = jwt.verify(token, 'some-secret-value');

    //find User by Id and return it
    const user = await User.findById(decoded._id);
    ctx.body = user.serialize();
  } catch (error) {
    ctx.throw(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
