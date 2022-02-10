import { Modal } from "react-bootstrap"; 

function FormatGuideModal(props: {
    show: boolean,
    onHide: () => void,
}) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            📖 Formatting Guide
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>
                You can format the text of the book using <a href="https://www.markdowntutorial.com/">markdown</a>. If you don't know how to use markdown you only need to know two things:
            </p>
            <ol>
                <li>To make a <strong>chapter heading</strong> put a <samp># </samp> in front of the chapter title.</li>
                <li>Leave an <strong>empty line between every paragraph</strong>.</li>
            </ol>
            <p>For example:</p>
            <textarea
                spellCheck="false"
                className="form-control"
                rows={15}
            >{`# A Chapter Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

# Another Chapter

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
`}</textarea>
        </Modal.Body>
        <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={props.onHide}>
                Close
            </button>
        </Modal.Footer>
      </Modal>
    );
}

export default FormatGuideModal;