/**
 * Waits a number of milliseconds.
 * @param time the number of milliseconds to wait.
 */
export default function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
