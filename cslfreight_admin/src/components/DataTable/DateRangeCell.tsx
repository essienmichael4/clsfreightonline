import { format, isValid } from "date-fns";

interface Props {
  startDate: Date | string;
  endDate: Date | string;
}

const DateRangeCell: React.FC<Props> = ({ startDate, endDate }) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Handle missing or invalid dates
  if (!start || !end || !isValid(start) || !isValid(end)) {
    return <span>-</span>;
  }

  const formatted = `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;

  return <span>{formatted}</span>;
};

export default DateRangeCell;
