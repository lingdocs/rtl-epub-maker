export function makeProgressPercent(e: { total: number, loaded: number}): number {
    const { total, loaded } = e;
    const progress = (total !== 0)
        ? Math.floor((loaded / total) * 100)
        : 0;
    return progress > 0 ? progress : 0;
}

export function bookRequest(req: {
    frontmatter: Frontmatter,
    content: string,
    cover?: File,
}, callback: {
    start: (upload: { cancel: () => void }) => void,
    progress: (percentage: number) => void,
    error: () => void,
}) {
    const formData = new FormData();
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    formData.append("content", req.content);
    formData.append("frontmatter", JSON.stringify(req.frontmatter));
    if ("cover" in req && req.cover) {
        formData.append("file", req.cover);
    }
    xhr.onload = () => {
        const url = window.URL.createObjectURL(xhr.response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${req.frontmatter.title}.epub`;
        document.body.appendChild(a);
        a.click();    
        a.remove();
    };
    xhr.upload.addEventListener('progress', (e) => {
        const progress = makeProgressPercent(e);
        callback.progress(progress);
    }, false);
    xhr.addEventListener('error', (e) => {
        console.error(e);
        callback.error();
    }, false);
    xhr.open("POST", "/api/book");
    xhr.send(formData);
    function cancel() {
        xhr.abort();
    }
    callback.start({ cancel });
}

export function uploadDoc(file: File, callback: {
    start: (upload: { cancel: () => void }) => void,
    progress: (percentage: number) => void,
    error: () => void,
    complete: (markdown: string) => void,
}) {
    const formData = new FormData();
    const xhr = new XMLHttpRequest();
    formData.append("file", file);
    xhr.onload = () => {
        try {
            const { markdown } = JSON.parse(xhr.responseText);
            callback.complete(markdown);
        } catch (e) {
            console.error(e);
            callback.error();
        }
    };
    xhr.upload.addEventListener('progress', (e) => {
        const progress = makeProgressPercent(e);
        callback.progress(progress);
    }, false);
    xhr.addEventListener('error', (e) => {
        console.error(e);
        callback.error();
    }, false);
    xhr.open("POST", "/api/file");
    xhr.send(formData);
    function cancel() {
        xhr.abort();
    }
    callback.start({ cancel });
}