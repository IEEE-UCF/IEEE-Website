interface CalendarProps {
  className: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  return (
    <iframe
      src="https://calendar.google.com/calendar/embed?src=ieee.ucf%40gmail.com&ctz=America%2FNew_York&bgcolor=%23FFFFFF&color=%23FFD700&showTitle=0&showPrint=0&showTabs=0&showCalendars=0"
      className={className}
    ></iframe>
  );
};

export { Calendar };
