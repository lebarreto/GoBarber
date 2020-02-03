import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class CancellationMail{

  get key(){
    return 'CancellationMail';
  }

  async handle({ data }){
    const { appointment } = data;

    console.log('Funcionou');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Appointment cancelled',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date, "dd MMMM',' H:mm")),
      }
    });
  }
}

export default new CancellationMail();