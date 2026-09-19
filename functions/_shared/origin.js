export function getPublicOrigin(request) {
  return new URL(request.url).origin;
}
