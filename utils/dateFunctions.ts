import { formatDistanceToNow } from "date-fns";

export const getFormatDistanceFromNow = (date: number) => {
  const fromNow = formatDistanceToNow(date);

  return `${fromNow} ago`;
};
