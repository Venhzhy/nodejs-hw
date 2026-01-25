import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page, perPage, tag, search } = req.query;
    const p = parseInt(page) || 1;
    const pp = parseInt(perPage) || 10;

    const filter = {};
    if (tag) filter.tag = tag;
    if (search) filter.$text = { $search: search };

    const totalNotes = await Note.countDocuments(filter);

    const totalPages = Math.ceil(totalNotes / pp);
    if (p > totalPages && totalNotes > 0) {
      throw createHttpError(404, 'Цієї сторінки не існує');
    }

    const skip = (p - 1) * pp;

    const notes = await Note.find(filter)
      .skip(skip)
      .limit(pp);

    res.status(200).json({
      page: p,
      perPage: pp,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

