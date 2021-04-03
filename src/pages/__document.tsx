import * as React from "react";
import Document, { Head, Main, NextScript } from "next/document";

export default class extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>skillZ</title>
          <link rel="icon" href="/favicon.svg" />
          <link
            rel="preload"
            href="/fonts/Nunito/Nunito-Regular.ttf"
            as="font"
            crossOrigin=""
          />
          <meta name="application-name" content="SkillZ" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="SkillZ" />
          <meta name="description" content="Register your skillz !" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/public/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#121212" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#1e1e1e" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/public/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/public/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/public/favicon-16x16.png"
          />
          <link rel="manifest" href="/public/skillz.webmanifest" />
          <link
            rel="mask-icon"
            href="/public/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/public/favicon.ico" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://skillz.zenika.com" />
          <meta name="twitter:title" content="Skillz" />
          <meta
            name="twitter:description"
            content="Skill management made easy"
          />
          <meta
            name="twitter:image"
            content="https://skills.zenika.com/public/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@ZenikaIT" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="SkillZ" />
          <meta
            property="og:description"
            content="Skill management made easy"
          />
          <meta property="og:site_name" content="SkillZ" />
          <meta property="og:url" content="https://skills.zenika.com" />
          <meta
            property="og:image"
            content="https://skills.zenika.com/public/apple-touch-icon.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
