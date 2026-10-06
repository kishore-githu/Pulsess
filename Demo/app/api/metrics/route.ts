import { faultResponse, isFault, json, wait } from "@/lib/api";
import { getMetrics, parsePlan, parseRange } from "@/lib/ledger";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (isFault(params.get("fault"))) return faultResponse();
  await wait();
  return json(getMetrics(parseRange(params.get("range")), parsePlan(params.get("plan"))));
}
