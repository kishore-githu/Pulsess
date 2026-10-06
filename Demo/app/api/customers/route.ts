import {
  clampQuery,
  faultResponse,
  isFault,
  json,
  parseCustomerSort,
  parseDir,
  parsePage,
  parsePageSize,
  parseSegment,
  wait,
} from "@/lib/api";
import { getCustomers, parsePlan, parseRange } from "@/lib/ledger";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (isFault(params.get("fault"))) return faultResponse();
  await wait();
  return json(
    getCustomers({
      range: parseRange(params.get("range")),
      q: clampQuery(params.get("q")),
      segment: parseSegment(params.get("segment")),
      sort: parseCustomerSort(params.get("sort")),
      dir: parseDir(params.get("dir")),
      page: parsePage(params.get("page")),
      pageSize: parsePageSize(params.get("pageSize"), 6),
    }, parsePlan(params.get("plan"))),
  );
}
