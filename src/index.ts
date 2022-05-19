import QRCode from "qrcode-svg";
import { getContentType, isValidExtension } from "./ext";
import { getUserPageUrl, isValidPageType } from "./pageType";

const MAXAGE = 60 * 60;
const S_MAXAGE = 60 * 60 * 24;

export default {
  async fetch(request: Request): Promise<Response> {
    return handle(request);
  },
};

const handle = async (request: Request): Promise<Response> => {
  if (request.method !== "GET") {
    return new Response("method not implemented", { status: 501 });
  }
  const cache = caches.default;
  const cachedResponse = await cache.match(request);
  if (cachedResponse != null) {
    return cachedResponse;
  }
  const url = new URL(request.url);
  const [pageType, value] = url.pathname.slice(1).split("/");
  if (!isValidPageType(pageType) || value == null) {
    return new Response("bad request", { status: 400 });
  }
  const [username, extension] = value.split(".");
  if (username == null || extension == null) {
    return new Response("bad request", { status: 400 });
  }
  if (!isValidExtension(extension)) {
    return new Response(`${extension} is unprocessable`, { status: 422 });
  }
  const qr = new QRCode({
    content: getUserPageUrl(pageType, username),
    ecl: "H",
    padding: 0,
    width: 512,
    height: 512,
  });
  const response = new Response(qr.svg(), {
    headers: {
      "Content-Type": getContentType(extension),
      Vary: "Accept-Encoding",
      "Cache-Control": `max-age: ${MAXAGE}, s-maxage: ${S_MAXAGE}`,
    },
  });
  cache.put(request, response.clone());
  return response;
};
