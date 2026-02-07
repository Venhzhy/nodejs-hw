import { Router } from 'express';
import { celebrate } from 'celebrate';
import validateBody from '../middleware/validateBody.js';
import {
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';

import {
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';


import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';

import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post(
  '/auth/register',
  celebrate(registerUserSchema),
  registerUser
);

router.post(
  '/auth/login',
  celebrate(loginUserSchema),
  loginUser
);

router.post(
  '/auth/request-reset-email',
  validateBody(requestResetEmailSchema),
  requestResetEmail
);

router.post(
  '/auth/reset-password',
  validateBody(resetPasswordSchema),
  resetPassword
);


router.post('/auth/refresh', refreshUserSession);
router.post('/auth/logout', logoutUser);

export default router;

