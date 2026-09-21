const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Shanghai"
});

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}
