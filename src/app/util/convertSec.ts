export function convertSec(s: number | null): string {
  if (s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);

    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  } else {
    return '0:00';
  }
}
