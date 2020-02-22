import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import authMiddleware from './app/middlewares/auth';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

const routes = new Router();
const upload = multer(multerConfig);

// user
routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.put('/user', UserController.update);

// files
routes.post('/files', upload.single('file'), FileController.upload);

// apointments
routes.post('/appointments', AppointmentController.createAppointment);
routes.get('/appointments', AppointmentController.listAppointment);
routes.delete('/appointments/:id', AppointmentController.cancelAppointment);

// providers
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.list);

// schedules
routes.get('/schedules', ScheduleController.listSchedule);

// notifications
routes.get('/notifications', NotificationController.listNotification);
routes.put('/notifications/:id', NotificationController.update);

export default routes;