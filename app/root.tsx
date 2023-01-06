import React from "react";
import styles from "./styles/app.css";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "CarbonABLE bridge from Juno to Starknet",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader() {
  return json({
    ENV: {
      JUNO_ADMIN_ADDRESS: process.env.JUNO_ADMIN_ADDRESS,
      STARKNET_ADMIN_ADDRESS: process.env.STARKNET_ADMIN_ADDRESS,
      API_URL: process.env.API_URL,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="fr" className="bg-neutral-800 text-white">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
