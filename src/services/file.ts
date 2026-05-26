import { request } from './request'

export interface IReqGetPresignedUrlParams {
  md5: string
  filename: string
  contentType: string
  folder?: string
}

export interface IReqConfirmUploadParams {
  md5: string
  filename: string
  contentType: string
  size: number
  folder?: string
}

export interface IResCheckFileResponse {
  exists: boolean
  url?: string
}

export interface IResGetPresignedUrlResponse {
  uploadUrl: string
  fileUrl: string
}

export interface IResConfirmUploadResponse {
  id: string
  url: string
  filename: string
  contentType: string
  size: number
}

export const reqPostCheckFile = (md5: string) =>
  request<{ code: number; message: string; data: IResCheckFileResponse }>({
    url: '/api/files/check',
    method: 'POST',
    data: { md5 },
  }).then(res => res.data)

export const reqPostPresignedUrl = (data: IReqGetPresignedUrlParams) =>
  request<{ code: number; message: string; data: IResGetPresignedUrlResponse }>({
    url: '/api/files/presigned-url',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPostConfirmUpload = (data: IReqConfirmUploadParams) =>
  request<{ code: number; message: string; data: IResConfirmUploadResponse }>({
    url: '/api/files/confirm',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPostReleaseFile = (fileId: string) =>
  request<void>({
    url: '/api/files/release',
    method: 'POST',
    data: { fileId },
  })
