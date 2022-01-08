import { strftime } from "lib/strftime";

export function Strftime({ date }) {
  if (date === null || date === undefined) {
    return <></>;
  }
  if (typeof date === "string") {
    date = new Date(date);
  }

  return <span className="font-mono">{strftime("%Y/%m/%d %H:%M", date)}</span>;
}
