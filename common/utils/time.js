export function getTimeAfterSeconds(time,seconds) {
    const currentTime = new Date(time);
    const futureTime = new Date(currentTime.getTime() + seconds * 1000);
    return futureTime;
}