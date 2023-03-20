import z from "./zerofill.js";

export const formatDateTime = (ts) => {
  const d = new Date(ts);

  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();

  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  return `${year}/${z(month)}/${z(day)} ${z(hour)}:${z(minute)}:${z(second)}`;
};
