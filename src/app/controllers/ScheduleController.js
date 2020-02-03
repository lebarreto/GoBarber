import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController{

  async listSchedule(req, res){

    // check if user is provider or not
    const checkProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    });

    if(!checkProvider){
      return res.status(401).json({ error: 'User is not a provider' });
    }

    // list by actual date
    const { date } = req.query;
    const parseDate = parseISO(date);

    console.log(req.userId);

    const appointments = await Appointment.findAll({
      where: {
        providers_id: req.userId,
        calceled_at: null,
        date: {
          [ Op.between ]: [ startOfDay(parseDate), endOfDay(parseDate) ],
        },
      },
      order: [ 'date' ]
    })

    return res.json(appointments);
  }

}

export default new ScheduleController();