
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const MyEvent = ({ event }: any) => {
  return (
      <div>
        <strong>{event.title}</strong>
        <p>{event.desc}</p>
      </div>
  );
};

const localizer = momentLocalizer(moment);
const Index = () => {

    const myEvents = [
        {
            salle: "salle 01",
            title: 'Événement 1',
            start: new Date(2023, 10, 8, 10, 0),
            end: new Date(2023, 10, 10, 12, 0),
            desc: 'Description de lévénement 1',
        },
        {
            salle: "salle 02",
            title: 'Événement 2',
            start: new Date(2023, 10, 9, 10, 0),
            end: new Date(2023, 10, 10, 12, 0),
            desc: 'Description de lévénement 2',
        },
        {
            salle: "salle 02",
            title: 'Événement 2',
            start: new Date(2023, 10, 9, 10, 0),
            end: new Date(2023, 10, 10, 12, 0),
            desc: 'Description de lévénement 2',
        },
        // Ajoutez d'autres événements
    ];
  return (
      <div className="w-75">
        {/*<Calendar*/}
        {/*    localizer={localizer}*/}
        {/*    events={myEvents}*/}
        {/*    components={{*/}
        {/*      event: MyEvent,*/}
        {/*    }}*/}
        {/*/>*/}
      </div>
  ) ;
};

export default Index;
