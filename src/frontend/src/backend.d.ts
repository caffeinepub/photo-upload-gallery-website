import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PhotoMetadata {
    id: string;
    contentType: string;
    blob: ExternalBlob;
    name: string;
    timestamp: bigint;
}
export interface backendInterface {
    addPhoto(id: string, name: string, contentType: string, timestamp: bigint, blob: ExternalBlob): Promise<void>;
    getPhoto(id: string): Promise<PhotoMetadata | null>;
    listPhotos(): Promise<Array<PhotoMetadata>>;
}
