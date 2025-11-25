// src/modules/qrCreator/qrCreator.config.ts

import QRCodeStyling from 'qr-code-styling'
import type { Options, DownloadOptions } from 'qr-code-styling';
import type { EnabledConfigOptions } from './qrCreator.d';

export const enabledConfigOptions: EnabledConfigOptions = {
  basicOptions: true,
  dotsOptions: true,
  cornerSquareOptions: true,
  cornersDotOptions: true,
  backgroundOptions: true,
  imageOptions: true,
  qrOptions: false // ⚠️ DESHABILITADO
}

export const defaultConfigOptions: Options = {
  type: 'svg', // 'canvas' | 'svg'
  shape: 'square', // 'square' | 'circle'
  width: 250,
  height: 250,
  margin: 10,
  data: '', // empty input
  dotsOptions:{
    type: 'square',
    color: 'black',
    gradient: undefined,
    roundSize: undefined
  },
  cornersSquareOptions: {
    type: 'square',
    color: 'black',
    gradient: undefined
  },
  cornersDotOptions: {
    type: 'square',
    color: 'black',
    gradient: undefined
  },
  backgroundOptions:{
    color: 'white',
    gradient: undefined,
    round: undefined
  },
  image: undefined,
  imageOptions: {
    saveAsBlob: undefined,
    hideBackgroundDots: undefined,
    imageSize: 1,
    margin: 0,
    crossOrigin: undefined, // 'anonymous' | 'use-credentials' | undefined
  },
  qrOptions:{
    typeNumber: 0,
    mode: 'Byte', 
    errorCorrectionLevel: 'M', 
  },
}

export const defaultCustomConfigOptions = {
  colorStyle: 'single'
}

export const defaultDownloadOptions: DownloadOptions = {
  name: 'qr-code',
  extension: 'png', // "svg" | "png" | "jpeg" | "webp"
}

/**
 * Factory function para crear una nueva instancia de QRCodeStyling.
 * Esto permite tener instancias locales por componente en lugar de una global.
 * 
 * @returns Nueva instancia de QRCodeStyling
 */
export const createQRCodeInstance = () => {
  return new QRCodeStyling(defaultConfigOptions);
}

/** #info
 * 
 * 1 - Si en defaultConfigOptions, se hace type = 'canvas', entonces el codigo QR generado va a parpadear cada vez que se modifique un input (como cuando de deslizan los sliders)
*/