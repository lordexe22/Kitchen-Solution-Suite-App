// Copied and adapted minimal config for QR Creator
import QRCodeStyling from 'qr-code-styling'
import type { Options, DownloadOptions } from 'qr-code-styling';
import type { EnabledConfigOptions } from './qrCreator.d'

export const enabledConfigOptions: EnabledConfigOptions = {
  basicOptions: true,
  dotsOptions: true,
  cornerSquareOptions: true,
  cornersDotOptions: true,
  backgroundOptions: true,
  imageOptions: true,
  qrOptions: true
}

export const defaultConfigOptions: Options = {
  type: 'svg',
  shape: 'square',
  width: 250,
  height: 250,
  margin: 10,
  data: '',
  dotsOptions:{ type: 'square', color: 'black' },
  cornersSquareOptions: { type: 'square', color: 'black' },
  cornersDotOptions: { type: 'square', color: 'black' },
  backgroundOptions:{ color: 'white' },
  image: undefined,
  imageOptions: { imageSize: 1, margin: 0 },
  qrOptions:{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'M' }
}

export const defaultDownloadOptions: DownloadOptions = {
  name: 'qr-code',
  extension: 'png'
}

export const qrCode = new QRCodeStyling(defaultConfigOptions as any)
