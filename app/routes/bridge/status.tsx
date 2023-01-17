import { json, LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const wallet = url.searchParams.get("wallet");
  const addr = url.searchParams.get("starknetAdrr");
  const res = await fetch(
    process.env.API_URL + `/customer/data/${wallet}/${addr}`,
    { headers: { Accept: "application/json" }, mode: "cors" }
  );
  return json(await res.json());
}
