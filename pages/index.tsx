import type { NextPage } from "next";
import { useState, useRef } from "react";
import Head from "next/head";
import BookInfoInput from "../components/BookInfoInput";
import DocReceiver from "../components/DocReceiver";
import { bookRequest } from "../lib/fetchers";
import FormatGuideModal from "../components/FormatGuideModal";
import Script from "next/script";

// TODO: Make Title Required
// TODO: Have author field in there
// TODO: Allow Word File straight w/ images etc upload
// TDOO: Add language selection option (Pashto, Arabic, Farsi, Urdu)

const Home: NextPage = () => {
  const mdRef = useRef<any>(null);
  const [showFormatGuide, setShowFormatGuide] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");
  function handleReceiveText(m: string) {
    mdRef.current.value = m;
  }
  function clearText() {
    mdRef.current.value = "";
  }
  function handleSubmit(info: { frontmatter: Frontmatter, cover: File | undefined }) {
    const content = mdRef.current.value as string;
    if (!content) {
      alert("Please enter some content for the book");
      return;
    }
    if (!info.frontmatter.title) {
      alert("Please enter a title for the book");
      return;
    }
    setSubmissionStatus("");
    bookRequest({
      ...info,
      content,
    }, {
      complete: () => setSubmissionStatus("Done"),
      progress: (p) => setSubmissionStatus(p < 100 ? `Uploading ${p}%...` : "Processing..."),
      error: () => setSubmissionStatus("Error"),
    });
  }
  return (
    <div className="container" style={{ marginBottom: "50px", maxWidth: "950px" }}>
      <Head>
        <title>RTL EPUB Maker</title>
        <meta name="description" content="Easily create EPUB e-book files with proper RTL support" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4L08QX2FXM"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-4L08QX2FXM', { 'anonymize_ip': true });
      `}</Script>
      <h1 className="mt-3">RTL EPUB Maker 📚</h1>
      <p className="lead mb-4">Easily create EPUB e-book files with proper RTL support</p>
      <h4 className="mb-3">Book Content</h4>
      <DocReceiver handleReceiveText={handleReceiveText}/>
      <div className="mt-3">
        <label htmlFor="mdTextarea" className="form-label d-flex flex-row justify-content-between align-items-center">
          <div>Text in Markdown</div>
          <div>
            <button type="button" className="btn btn-sm btn-light" onClick={() => setShowFormatGuide(true)}>
              📖 Formatting Guide
            </button>
          </div>
        </label>
        <textarea
          placeholder="or paste book content here..."
          spellCheck="false"
          dir="rtl"
          ref={mdRef}
          className="form-control"
          id="mdTextarea"
          rows={15}
        />
      </div>
      <div style={{ textAlign: "right" }}>
        <button type="button" className="btn btn-sm btn-light mt-2" onClick={clearText}>Clear</button>
      </div>
      <h4>Book Metadata</h4>
      <BookInfoInput handleSubmit={handleSubmit} />
      <div>
        <samp>{submissionStatus}</samp>
      </div>
      <div className="text-center mt-4 text-muted">
        <p className="lead">Made by <a className="em-link" href="https://lingdocs.com">LingDocs.com</a></p>
        <p>Submissions are private. Nothing is kept on the server. See the <a className="em-link" href="https://github.com/lingdocs/rtl-epub-maker">source code here</a>.</p>
      </div>
      <FormatGuideModal show={showFormatGuide} onHide={() => setShowFormatGuide(false)} />
    </div>
  )
}

export default Home
