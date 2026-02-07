import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { sendMail } from '../utils/sendMail.js';
import bcrypt from 'bcryptjs';

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Invalid or expired token');
    }

    const user = await User.findOne({
      _id: payload.sub,
      email: payload.email,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    }

    const token = jwt.sign(
      { sub: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const templatePath = path.resolve(
      'src/templates/reset-password-email.html'
    );
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const html = template({
      username: user.username,
      link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`,
    });

    await sendMail({
      to: email,
      subject: 'Reset password',
      html,
    });

    res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch (_rr) {
    next(
      createHttpError(
        500,
        'Failed to send the email, please try again later.'
      )
    );
  }
};

