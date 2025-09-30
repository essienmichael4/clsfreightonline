import { format } from "date-fns";

interface Props {
  startDate: Date | string;
  endDate: Date | string;
}

const DateRangeCell: React.FC<Props> = ({ startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Format like: Feb 05 - Feb 10, 2025
  const formatted = `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;

  return <span>{formatted}</span>;
};

export default DateRangeCell;
