import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const { secure_url } = await saveFileToCloudinary(req.file.buffer);

    await User.findByIdAndUpdate(req.user._id, {
      avatar: secure_url,
    });

    res.status(200).json({ url: secure_url });
  } catch (err) {
    next(err);
  }
};

