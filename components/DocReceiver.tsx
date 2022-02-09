import { useDropzone } from "react-dropzone";
import { uploadDoc } from "../lib/fetchers";

function DocReceiver({ handleReceiveText }: {
    handleReceiveText: (content: string) => void,
}) {
    function onDrop(files: File[]) {
        uploadDoc(files[0], {
            start: () => null,
            error: () => null,
            progress: () => null,
            complete: (m: string) => {
                handleReceiveText(m);
            }
        })
    }
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        // accept: [".doc", ".docx", ".md", ".txt", "text/*", ""],
    });
    return <div {...getRootProps()} className="clickable d-flex flex-row align-items-center justify-content-center" style={{ padding: "2rem 1rem", border: "2px dashed grey", textAlign: "center", backgroundColor: isDragActive ? "#34a8eb" : "inherit" }}>
            <input {...getInputProps()} />
            <div className="text-muted">Add Text/Markdown File or Word Doc</div>
    </div>;
}

export default DocReceiver;