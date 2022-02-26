export function convertMs(ms: number | null): string {
  if (ms) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);

    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  } else {
    return '0:00';
  }
}
