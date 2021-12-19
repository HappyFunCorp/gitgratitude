import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  
  render() {
    const script = 'console.log( "Hi there" );'
 
    return (
      <Html>
        <Head />
        <body className="dark:bg-gray-900 dark:text-blue-100">
          <script src="/sql-wasm.js"/>
          <script type="module" src="/sql-loader.js"/>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument