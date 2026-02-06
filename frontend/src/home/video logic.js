export function hasWatchedThreshold(videoElement, thresholdPercent = 30) {
  if (!videoElement) return false;
  const currentTime = videoElement.currentTime;
  console.log(currentTime)
  const duration = videoElement.duration;
  console.log(duration)
  if (!duration) return false;
  return (currentTime / duration) * 100 >= thresholdPercent;
}