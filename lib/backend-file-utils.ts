import { unlink, statSync } from "fs";

export function deleteFile(...files: (string | undefined)[]) {
    files.forEach((f) => {
        if (!f) return;
        try {
            statSync(f);
        } catch(e) {
            console.error("file not found for deletion:", f);
            return;
        }
        unlink(f, (err) => {
            if (err) console.error(err);
        });
    });
}