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
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPhoto(id: string, name: string, contentType: string, timestamp: bigint, blob: ExternalBlob): Promise<void>;
    addShortLink(id: string, shortCode: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canUpload(): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryStats(): Promise<[bigint, bigint]>;
    getPhoto(id: string): Promise<PhotoMetadata | null>;
    getPhotoByShortCode(shortCode: string): Promise<PhotoMetadata | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listPhotos(): Promise<Array<PhotoMetadata>>;
    resolveShortLink(shortCode: string): Promise<string | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
