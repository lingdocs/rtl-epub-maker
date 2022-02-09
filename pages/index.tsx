import type { NextPage } from "next";
import { useRef } from "react";
import Head from "next/head";
import BookInfoInput from "../components/BookInfoInput";
import DocReceiver from "../components/DocReceiver";
import { bookRequest } from "../lib/fetchers";

// TODO: Make Title Required
// TODO: Allow Word File straight w/ images etc upload
// TDOO: Add language selection option (Pashto, Arabic, Farsi, Urdu)

const Home: NextPage = () => {
  const mdRef = useRef<any>(null);
  function handleReceiveText(m: string) {
    mdRef.current.value = m;
  }
  function clearText() {
    mdRef.current.value = "";
  }
  function handleSubmit(info: { frontmatter: Frontmatter, cover: File | undefined }) {
    const content = mdRef.current.value as string;
    bookRequest({
      ...info,
      content,
    }, {
      // TODO: Implement progress display etc
      start: () => null,
      progress: () => null,
      error: () => null,
    });
  }
  return (
    <div className="container" style={{ marginBottom: "50px" }}>
      <Head>
        <title>RTL EPUB Maker</title>
        <meta name="description" content="Easily create EPUB e-book files with proper RTL support" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mt-3">RTL EPUB Maker 📚</h1>
      <p className="lead mb-4">Easily create EPUB e-book files with proper RTL support</p>
      <DocReceiver handleReceiveText={handleReceiveText}/>
      <div className="mt-3">
        <label htmlFor="mdTextarea" className="form-label">Markdown Content</label>
        <textarea spellCheck="false" dir="rtl" ref={mdRef} className="form-control" id="mdTextarea" rows={15} />
      </div>
      <div style={{ textAlign: "right" }}>
        <button type="button" className="btn btn-sm btn-light mt-2" onClick={clearText}>Clear</button>
      </div>
      <BookInfoInput handleSubmit={handleSubmit} />
      <div className="text-center mt-4 text-muted">
        <p className="lead">Made by <a className="em-link" href="https://lingdocs.com">LingDocs.com</a></p>
        <p>Submissions are private. Nothing is kept on the server. See the <a className="em-link" href="https://github.com/lingdocs/rtl-epub-maker">source code here</a>.</p>
      </div>
    </div>
  )
}

export default Home
