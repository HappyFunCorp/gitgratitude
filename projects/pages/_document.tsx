import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
