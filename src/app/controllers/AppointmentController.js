import * as Yup from 'yup'; 
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController{

  async listAppointment(req, res){
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        calceled_at: null
      },
      order: ['date'],
      attributes: [ 'id', 'date', 'past', 'cancelable' ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: [ 'id', 'name' ],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes:[ 'id', 'path', 'url' ]
            }
          ]
        }
      ]
    });

    return res.json(appointments);
  }

  async createAppointment(req, res){
    const schema = Yup.object().shape({
      providers_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { providers_id, date } = req.body;

    // check if provider_id is a provider
    const isProvider = await User.findOne({ 
      where: {
        id: providers_id, 
        provider: true
      }
    });

    if(!isProvider){
      return res.status(401).json({ error: 'You can only create appointments with providers' });
    }

    // check if it is a past date
    const hourStart = startOfHour(parseISO(date));

    if(isBefore(hourStart, new Date())){
      return res.status(400).json({ error: 'Past date is not allowed' });
    }

    // check if provider does not have another appointment at the same time
    const checkAvailability = await Appointment.findOne({
      where: {
        providers_id,
        calceled_at: null,
        date: hourStart
      }
    });

    if(checkAvailability){
      return res.status(400).json({ error: 'Appointment date is not available' });
    }

    // create appointment
    const appointment = await Appointment.create({
      user_id: req.userId,
      providers_id,
      date: hourStart
    });

    // notify appointment to provider
    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "dd MMMM',' H:mm");

    await Notification.create({
      content: `New appointment from ${user.name} for ${formattedDate}`,
      user: providers_id,
    });

    return res.json(appointment);
  }

  async cancelAppointment(req, res){
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: [ 'name', 'email' ]
        },
        {
          model: User,
          as: 'user',
          attributes: [ 'name' ]
        }
      ]
    });

    console.log(appointment.user_id);

    // verify if user has permission to cancel
    if(appointment.user_id != req.userId){
      return res.status(401).json({ error: "You don't have permission to cancel this appointment." });
    }
    
    // limit 2 hours before appointment 
    const dateWithSub = subHours(appointment.date, 2);

    if(isBefore(dateWithSub, new Date())){
      return res.status(401).json({ error: "You can only cancel appointments 2 hours in advance." });
    }

    appointment.calceled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }

}

export default new AppointmentController();