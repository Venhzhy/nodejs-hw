import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page, perPage, tag, search } = req.query;

    const p = Number(page) || 1;
    const pp = Number(perPage) || 10;

    const filter = {};
    if (tag) filter.tag = tag;
    if (search) filter.$text = { $search: search };

    const skip = (p - 1) * pp;

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter).skip(skip).limit(pp),
    ]);

    const totalPages = Math.ceil(totalNotes / pp);

    if (p > totalPages && totalNotes > 0) {
      throw createHttpError(404, 'Цієї сторінки не існує');
    }

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

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      throw createHttpError(404, 'Замітку не знайдено');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      throw createHttpError(404, 'Замітку не знайдено для оновлення');
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      throw createHttpError(404, 'Замітку не знайдено для видалення');
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};


