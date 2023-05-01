import type { AppType } from "next/app";

import { api } from "~/utils/api";

import { MantineProvider } from '@mantine/core';
import Head from "next/head";


const MyApp: AppType = ({
  Component,
  // pageProps: { session, ...pageProps },
  pageProps: { ...pageProps },
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
