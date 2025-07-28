export default function timeline() { 
    return(
        <div>

            hi
        </div>

    );
};
// "use client";

// import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
// import 'react-vertical-timeline-component/style.min.css';
// import EventIcon from '@mui/icons-material/Event';

// import { useState, useEffect } from "react"

// interface EventData {
//   _id: string; 
//   committee: string;
//   title: string;
//   time: Date;
//   address: string;
//   description: string;
//   flyer?: string;
//   rsvp?: string;
//   photos?: {
//     type?: string;
//     [key: string]: any; 
//   };
// }

// // sorry for the prop drilling... im rawdogging this on a plane
// // reminder to self to fix this mess later......
// const Timeline = ( {committee}: {committee: string;} ) => {
//   const monthOrder = {
//         January: 0,
//         February: 1,
//         March: 2,
//         April: 3,
//         May: 4,
//         June: 5,
//         July: 6,
//         August: 7,
//         September: 8,
//         October: 9,
//         November: 10,
//         December: 11
//   };

//   interface TimelineData {
//       month: keyof typeof monthOrder;
//       eventName: string;
//       eventDate: string;
//       eventDesc: string;
//       eventAddress: string;
//       eventCommittee: string;

//   }

//   const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

//   useEffect( () => {
//     fetchTimelineData();

//   }, []);

//   const fetchTimelineData = async () => {
//     const res = await fetch("/api/events", {method: "GET"});
//     const events = await res.json();

//     const groupedEvents: {
//       [key: string]:
//       {
//         eventName: string;
//         eventDate: string;
//         eventDesc: string;
//         eventAddress: string;
//         eventCommittee: string;

//       }

//     } = {};

//     events.data.forEach((event: EventData) => {
//       const eventDate = new Date(event.time);
//       const newDate = eventDate.toLocaleString("default", {month: "long", day: "numeric", hour: "numeric", minute: "numeric"});

//       const month = eventDate.toLocaleString("default", {month: "long"});

//       if(!groupedEvents[month]) {
//         groupedEvents[month] = {
//           eventName: "",
//           eventDate: "",
//           eventDesc: "",
//           eventAddress: "",
//           eventCommittee: ""

//         }

//       }

//       groupedEvents[month].eventCommittee = event.committee;

//       if(groupedEvents[month].eventCommittee === committee) {

//           groupedEvents[month].eventDate = newDate;
//           groupedEvents[month].eventName = event.title;
//           groupedEvents[month].eventDesc = event.description;
//           groupedEvents[month].eventAddress = event.address;

//       }

    

//     });

//       const transformedData: TimelineData[] = Object.keys(groupedEvents).map((month) => ({
//         month: month as keyof typeof monthOrder,
//         eventName: groupedEvents[month].eventName,
//         eventDate: groupedEvents[month].eventDate,
//         eventDesc: groupedEvents[month].eventDesc,
//         eventAddress: groupedEvents[month].eventAddress,
//         eventCommittee: groupedEvents[month].eventCommittee
          
//       }));

//       transformedData.sort((a, b) => {
//             return monthOrder[a.month] - monthOrder[b.month];

//       });
    
//       setTimelineData(transformedData);


//   };
//     return (
//       <div className="">
//           <VerticalTimeline>

//             {timelineData.map((event) => (
//                 <VerticalTimelineElement
//                   className="vertical-timeline-element--work"
//                   contentStyle={{ background: 'var(--ieee-dark-yellow)', color: '#fff' }}
//                   contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
//                   date={event.eventDate}
//                   iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
//                   icon={<EventIcon />}
//                   >
//                   <h3 className="vertical-timeline-element-title">{event.eventName}</h3>
//                   <h4 className="vertical-timeline-element-subtitle">{event.eventAddress}</h4>
//                   <p>
//                     {event.eventDesc}
//                   </p>
//                 </VerticalTimelineElement>

//             ))}


//         </VerticalTimeline>
//       </div>
      

//     );

// }

// export { Timeline }; 