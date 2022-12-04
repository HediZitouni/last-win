export function getTimeLeft(end: number) {
  const dateNow = Math.ceil(Date.now() / 1000);
  return end - dateNow;
}
