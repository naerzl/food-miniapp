import { request } from './request'

export interface IReqGetPresignedUrlParams {
  md5: string
  filename: string
  contentType: string
  folder?: 'dishes' | 'avatars' | 'temp'
}

export interface IReqConfirmUploadParams {
  md5: string
  storageKey: string
  originalName: string
  contentType: string
  size: number
  folder?: 'dishes' | 'avatars' | 'temp'
}

export interface IResCheckFileResponse {
  exists: boolean
  url?: string
}

export interface IResGetPresignedUrlResponse {
  uploadUrl: string
  storageKey: string
  expiresIn: number
}

export interface IResConfirmUploadResponse {
  id: string
  url: string
  filename: string
  contentType: string
  size: number
}

export const reqPostCheckFile = (md5: string) =>
  request<IResCheckFileResponse>({
    url: '/api/files/check',
    method: 'POST',
    data: { md5 },
  })

export const reqPostPresignedUrl = (data: IReqGetPresignedUrlParams) =>
  request<IResGetPresignedUrlResponse>({
    url: '/api/files/presigned-url',
    method: 'POST',
    data,
  })

export const reqPostConfirmUpload = (data: IReqConfirmUploadParams) =>
  request<IResConfirmUploadResponse>({
    url: '/api/files/confirm',
    method: 'POST',
    data,
  })

export const reqPostReleaseFile = (fileId: string) =>
  request<void>({
    url: '/api/files/release',
    method: 'POST',
    data: { fileId },
  })
