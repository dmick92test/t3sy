import type { AppType } from "next/app";
import type { Session } from "next-auth";

import { api } from "~/utils/api";

import { MantineProvider } from '@mantine/core';
import Head from "next/head";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Head>
        <title>Sy Job Board</title>
        <meta name="description" content="Job board hosted by Shiftyourself" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
