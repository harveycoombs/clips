import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export function formatBytes(bytes: number): string {
    switch (true) {
        case (bytes < 1024):
            return `${bytes} B`;
        case (bytes < 1024 * 1024):
            return `${(bytes / 1024).toFixed(2)} kB`;
        case (bytes < 1024 * 1024 * 1024):
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        default:
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
}

export function formatAge(raw: Date): string {
    let difference = (new Date().getTime() - raw.getTime());

    let years = Math.floor(difference / 1000 / 60 / 60 / 24 / 365);
    let months = Math.floor(difference / 1000 / 60 / 60 / 24 / 30);
    let weeks = Math.floor(difference / 1000 / 60 / 60 / 24 / 7);
    let days = Math.floor(difference / 1000 / 60 / 60 / 24);
    let hours = Math.floor(difference / 1000 / 60 / 60);
    let minutes = Math.floor(difference / 1000 / 60);
    let seconds = Math.floor(difference / 1000);

    return years ? `${years}y` : months ? `${months}mo` : weeks ? `${weeks}w` : days ? `${days}d` : hours ? `${hours}h` : minutes ? `${minutes}m` : `${seconds}s`;
}

export async function trimVideo(root: string, video: File, start: number, end: number, progressCallback: any): Promise<Blob> {
    let ffmpeg = createFFmpeg({
        log: true,
        corePath: `${root}/ffmpeg-core.js`,
        wasmPath: `${root}/ffmpeg-core.wasm`,
        workerPath: `${root}/ffmpeg-core.worker.js`
    });

    await ffmpeg.load();

    try {
        let inputName = `input-${video.name}`;
        let outputName = `output-${video.name}`;

        ffmpeg.FS("writeFile", inputName, await fetchFile(video));
        
        ffmpeg.setProgress(({ ratio }: any) => progressCallback(ratio * 100));

        await ffmpeg.run(
            "-i", inputName,
            "-ss", start.toString(),
            "-t", (end - start).toString(),
            "-c", "copy",
            outputName
        );

        let data = ffmpeg.FS("readFile", outputName);
        let parts = [new Uint8Array(data.buffer)];

        ffmpeg.FS("unlink", inputName);
        ffmpeg.FS("unlink", outputName);

        return new Blob(parts, { type: video.type ?? "video/mp4" });
    } finally {
        ffmpeg.exit();
    }
}

export function getVideoExtension(type: string): string {
    switch (type) {
        case "video/mp4":
        case "video/mpeg":
        case "video/webm":
            return `${type.substring(type.indexOf("/"))}`;
        case "video/quicktime":
            return "mov";            
        case "video/x-msvideo":
            return "avi";
        case "video/ogg":
            return "ogv";
        default:
            return "";
    }
}
