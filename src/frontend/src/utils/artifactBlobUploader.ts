/**
 * artifactBlobUploader.ts
 * Singleton that holds the real ICP blob upload function once wired from config.
 * This decouples artifact creation from the async actor initialization.
 */

type UploadFn = (bytes: Uint8Array, filename: string) => Promise<string>;

let _uploadFn: UploadFn | null = null;

export function setArtifactUploadFn(fn: UploadFn): void {
  _uploadFn = fn;
}

export function getArtifactUploadFn(): UploadFn | null {
  return _uploadFn;
}
