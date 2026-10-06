import {
  clampQuery,
  faultResponse,
  isFault,
  json,
  parseChannel,
  parseDir,
  parsePage,
  parsePageSize,
  parseStatus,
  parseTxSort,
  wait,
} from "@/lib/api";
import { getTransactions, parsePlan, parseRange } from "@/lib/ledger";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (isFault(params.get("fault"))) return faultResponse();
  await wait();
  return json(
    getTransactions({
      range: parseRange(params.get("range")),
      q: clampQuery(params.get("q")),
      status: parseStatus(params.get("status")),
      channel: parseChannel(params.get("channel")),
      sort: parseTxSort(params.get("sort")),
      dir: parseDir(params.get("dir")),
      page: parsePage(params.get("page")),
      pageSize: parsePageSize(params.get("pageSize"), 8),
    }, parsePlan(params.get("plan"))),
  );
}
