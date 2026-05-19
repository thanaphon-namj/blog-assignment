export const formatDate = (date: string): string => {
  const d = new Date(date);

  const dateStr = d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateStr} เวลา ${timeStr} น.`;
};
