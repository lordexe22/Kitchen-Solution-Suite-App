// src/modules/qrCreator/qrCreator.hooks.ts

// #section Imports
import { useEffect, useRef, useState, type RefObject } from 'react'
import { createQRCodeInstance } from './qrCreator.config'
import type QRCodeStyling from 'qr-code-styling';
import type { ColorType } from './qrCreator.d'
import type { 
  DotType, 
  GradientType, 
  Gradient, 
  CornerSquareType, 
  CornerDotType,
  FileExtension
} from 'qr-code-styling';
// #end-section

// #hook useQRInstance
/**
 * Crea y gestiona una instancia local de QRCodeStyling.
 * Esta instancia es única para cada componente que use este hook.
 * 
 * @returns {{ qrCode: QRCodeStyling }} Instancia de QRCodeStyling
 */
export const useQRInstance = () => {
  const qrCodeRef = useRef(createQRCodeInstance());
  return { qrCode: qrCodeRef.current };
}
// #end-hook

// #hook useQRContainerRef
/**
 * Create and manage a reference for the DOM element that will contain the QR code.
 *
 * This hook initializes a container reference and appends the QR code when the component mounts.
 * It is required for updating or re-rendering the QR code when its data or styles change.
 *
 * @param {Object} params
 * @param {QRCodeStyling} params.qrCode - Instancia de QRCodeStyling
 * 
 * @returns {{
 *   qrContainerRef: RefObject<HTMLDivElement>
 * }} A reference to the QR code container element.
 */
export const useQRContainerRef = ({ qrCode }: { qrCode: QRCodeStyling }) => {
  const qrContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = ''
      qrCode.append(qrContainerRef.current)
    }
  }, [qrCode])

  return {
    qrContainerRef
  }
}
// #end-hook

// #hook useBasicOptions
/**
 * Manage the basic options for the QR code: data, width, height, and margin.
 *
 * This hook exposes state setters for each option and automatically re-renders
 * the QR code inside the provided container when any of them change.
 *
 * @param {Object} params
 * @param {RefObject<HTMLDivElement | null>} params.qrContainerRef - Reference to the container where the QR code will be rendered.
 * @param {QRCodeStyling} params.qrCode - Instancia de QRCodeStyling
 *
 * @returns {{
 *   data: string | undefined,
 *   setData: Dispatch<SetStateAction<string | undefined>>,
 *   width: number,
 *   setWidth: Dispatch<SetStateAction<number>>,
 *   height: number,
 *   setHeight: Dispatch<SetStateAction<number>>,
 *   margin: number,
 *   setMargin: Dispatch<SetStateAction<number>>
 * }} The current QR options and their setters.
 */
export const useBasicOptions = ({ qrContainerRef, qrCode }: { qrContainerRef: RefObject<HTMLDivElement | null>, qrCode: QRCodeStyling }) => {
  // #state [data, setData]
  const [data, setData] = useState<string | undefined>(qrCode._options.data);
  // #end-state
  // #state [width, setWidth]
  const [width, setWidth] = useState<number>(qrCode._options.width);
  // #end-state
  // #state [height, setHeight]
  const [height, setHeight] = useState<number>(qrCode._options.height);
  // #end-state
  // #state [margin, setMargin]
  const [margin, setMargin] = useState<number>(qrCode._options.margin);
  // #end-state
  // #event updateQRCode
  useEffect(() => {
    // #step 1 - check container existence
    if (!qrContainerRef.current) return
    // #end-step
    // #step 2 - clear container
    qrContainerRef.current.innerHTML = ''
    // #end-step
    // #step 3 - update QR code options
    qrCode.update?.({
      data,
      width,
      height,
      margin
    })
    // #end-step
    // #step 4 - append QR code to container
    qrCode.append(qrContainerRef.current)
    // #end-step
  }, [data, width, height, margin, qrContainerRef, qrCode])
  // #end-event

  // #section return
  return {
    data, setData,
    width, setWidth,
    height, setHeight,
    margin, setMargin
  }
  // #end-section
}
// #end-hook

// #hook useDotsOptions
/**
 * Manage dots styling options (type, color, gradient).
 *
 * @param {Object} params
 * @param {RefObject<HTMLDivElement | null>} params.qrContainerRef - Container reference
 * @param {QRCodeStyling} params.qrCode - Instancia de QRCodeStyling
 */
export const useDotsOptions = ({ qrContainerRef, qrCode }: { qrContainerRef: RefObject<HTMLDivElement | null>, qrCode: QRCodeStyling }) => {
  const [dotType, setDotType] = useState<DotType>(qrCode._options.dotsOptions?.type ?? 'square')
  const [colorType, setColorType] = useState<ColorType>(qrCode._options.dotsOptions?.gradient ? 'gradient' : 'single')
  const [dotColor, setDotColor] = useState<string>(qrCode._options.dotsOptions?.color ?? '#000000')
  const [gradientType, setGradientType] = useState<GradientType>('linear')
  const [gradientColors, setGradientColors] = useState<string[]>(['#000000', '#008000'])
  const [gradientRotation, setGradientRotation] = useState<number>(0)

  useEffect(() => {
    if (!qrContainerRef.current) return
    qrContainerRef.current.innerHTML = ''

    const dotsOptions = { ...qrCode._options.dotsOptions, type: dotType }

    if (colorType === 'single') {
      dotsOptions.color = dotColor
      dotsOptions.gradient = undefined
    } else if (colorType === 'gradient') {
      const gradient: Gradient = {
        type: gradientType,
        rotation: gradientType === 'linear' ? (gradientRotation * Math.PI) / 180 : undefined,
        colorStops: gradientColors.map((color, index) => ({
          offset: index / (gradientColors.length - 1),
          color
        }))
      }
      dotsOptions.color = ''
      dotsOptions.gradient = gradient
    }

    qrCode.update?.({ dotsOptions })
    qrCode.append(qrContainerRef.current)
  }, [dotType, colorType, dotColor, gradientType, gradientColors, gradientRotation, qrContainerRef, qrCode])

  return { dotType, setDotType, colorType, setColorType, dotColor, setDotColor, gradientType, setGradientType, gradientColors, setGradientColors, gradientRotation, setGradientRotation }
}
// #end-hook

// #hook useCornersSquareOptions
/**
 * Manage corners square styling options.
 */
export const useCornersSquareOptions = ({ qrContainerRef, qrCode }: { qrContainerRef: RefObject<HTMLDivElement | null>, qrCode: QRCodeStyling }) => {
  const [CSType, setCSType] = useState<CornerSquareType>(qrCode._options.cornersSquareOptions?.type ?? 'square')
  const [CSColorType, setCSColorType] = useState<ColorType>(qrCode._options.cornersSquareOptions?.gradient ? 'gradient' : 'single')
  const [CSColor, setCSColor] = useState<string>(qrCode._options.cornersSquareOptions?.color ?? '#000000')
  const [CSGradientType, setCSGradientType] = useState<GradientType>('linear')
  const [CSGradientColors, setCSGradientColors] = useState<string[]>(['#000000', '#008000'])
  const [CSGradientRotation, setCSGradientRotation] = useState<number>(0)

  useEffect(() => {
    if (!qrContainerRef.current) return
    qrContainerRef.current.innerHTML = ''

    const cornersSquareOptions = { ...qrCode._options.cornersSquareOptions, type: CSType }

    if (CSColorType === 'single') {
      cornersSquareOptions.color = CSColor
      cornersSquareOptions.gradient = undefined
    } else if (CSColorType === 'gradient') {
      const gradient: Gradient = {
        type: CSGradientType,
        rotation: CSGradientType === 'linear' ? (CSGradientRotation * Math.PI) / 180 : undefined,
        colorStops: CSGradientColors.map((color, index) => ({
          offset: index / (CSGradientColors.length - 1),
          color
        }))
      }
      cornersSquareOptions.color = ''
      cornersSquareOptions.gradient = gradient
    }

    qrCode.update?.({ cornersSquareOptions })
    qrCode.append(qrContainerRef.current)
  }, [CSType, CSColorType, CSColor, CSGradientType, CSGradientColors, CSGradientRotation, qrContainerRef, qrCode])

  return { CSType, setCSType, CSColorType, setCSColorType, CSColor, setCSColor, CSGradientType, setCSGradientType, CSGradientColors, setCSGradientColors, CSGradientRotation, setCSGradientRotation }
}
// #end-hook

// #hook useCornersDotOptions
/**
 * Manage corners dot styling options.
 */
export const useCornersDotOptions = ({ qrContainerRef, qrCode }: { qrContainerRef: RefObject<HTMLDivElement | null>, qrCode: QRCodeStyling }) => {
  const [CDType, setCDType] = useState<CornerDotType>(qrCode._options.cornersDotOptions?.type ?? 'square')
  const [CDColorType, setCDColorType] = useState<ColorType>(qrCode._options.cornersDotOptions?.gradient ? 'gradient' : 'single')
  const [CDColor, setCDColor] = useState<string>(qrCode._options.cornersDotOptions?.color ?? '#000000')
  const [CDGradientType, setCDGradientType] = useState<GradientType>('linear')
  const [CDGradientColors, setCDGradientColors] = useState<string[]>(['#000000', '#008000'])
  const [CDGradientRotation, setCDGradientRotation] = useState<number>(0)

  useEffect(() => {
    if (!qrContainerRef.current) return
    qrContainerRef.current.innerHTML = ''

    const cornersDotOptions = { ...qrCode._options.cornersDotOptions, type: CDType }

    if (CDColorType === 'single') {
      cornersDotOptions.color = CDColor
      cornersDotOptions.gradient = undefined
    } else if (CDColorType === 'gradient') {
      const gradient: Gradient = {
        type: CDGradientType,
        rotation: CDGradientType === 'linear' ? (CDGradientRotation * Math.PI) / 180 : undefined,
        colorStops: CDGradientColors.map((color, index) => ({
          offset: index / (CDGradientColors.length - 1),
          color
        }))
      }
      cornersDotOptions.color = ''
      cornersDotOptions.gradient = gradient
    }

    qrCode.update?.({ cornersDotOptions })
    qrCode.append(qrContainerRef.current)
  }, [CDType, CDColorType, CDColor, CDGradientType, CDGradientColors, CDGradientRotation, qrContainerRef, qrCode])

  return { CDType, setCDType, CDColorType, setCDColorType, CDColor, setCDColor, CDGradientType, setCDGradientType, CDGradientColors, setCDGradientColors, CDGradientRotation, setCDGradientRotation }
}
// #end-hook

// #hook useBackgroundOptions
/**
 * Manage background styling options.
 */
export const useBackgroundOptions = ({ qrContainerRef, qrCode }: { qrContainerRef: RefObject<HTMLDivElement | null>, qrCode: QRCodeStyling }) => {
  const [BGColorType, setBGColorType] = useState<ColorType>(qrCode._options.backgroundOptions?.gradient ? 'gradient' : 'single')
  const [BGColor, setBGColor] = useState<string>(qrCode._options.backgroundOptions?.color ?? '#ffffff')
  const [BGGradientType, setBGGradientType] = useState<GradientType>('linear')
  const [BGGradientColors, setBGGradientColors] = useState<string[]>(['#ffffff', '#cccccc'])
  const [BGGradientRotation, setBGGradientRotation] = useState<number>(0)

  useEffect(() => {
    if (!qrContainerRef.current) return
    qrContainerRef.current.innerHTML = ''

    const backgroundOptions = { ...qrCode._options.backgroundOptions }

    if (BGColorType === 'single') {
      backgroundOptions.color = BGColor || ''
      backgroundOptions.gradient = undefined
    } else if (BGColorType === 'gradient') {
      const gradient: Gradient = {
        type: BGGradientType,
        rotation: BGGradientType === 'linear' ? (BGGradientRotation * Math.PI) / 180 : undefined,
        colorStops: BGGradientColors.map((color, index) => ({
          offset: index / (BGGradientColors.length - 1),
          color
        }))
      }
      backgroundOptions.color = ''
      backgroundOptions.gradient = gradient
    }

    qrCode.update?.({ backgroundOptions })
    qrCode.append(qrContainerRef.current)
  }, [BGColorType, BGColor, BGGradientType, BGGradientColors, BGGradientRotation, qrContainerRef, qrCode])

  return {
    BGColorType, setBGColorType,
    BGColor, setBGColor,
    BGGradientType, setBGGradientType,
    BGGradientColors, setBGGradientColors,
    BGGradientRotation, setBGGradientRotation
  }
}
// #end-hook

// #hook useImageOptions
/**
 * Manage image options (logo in center of QR).
 */
export const useImageOptions = ({ qrContainerRef, qrCode }: { qrContainerRef: RefObject<HTMLDivElement | null>, qrCode: QRCodeStyling }) => {
  const [qrImage, setQRImage] = useState<File | undefined>(undefined)
  const [hideBackgroundDots, setHideBackgroundDots] = useState(false)
  const [imageScale, setImageScale] = useState(1)
  const [imageMargin, setImageMargin] = useState(0)

  useEffect(() => {
    if (!qrContainerRef.current) return
    qrContainerRef.current.innerHTML = ''

    if (qrImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        qrCode.update?.({
          image: imageDataUrl,
          imageOptions: {
            hideBackgroundDots,
            imageSize: imageScale,
            margin: imageMargin
          }
        })
        qrCode.append(qrContainerRef.current!)
      }
      reader.readAsDataURL(qrImage)
    } else {
      qrCode.update?.({
        image: undefined,
        imageOptions: {
          hideBackgroundDots: false,
          imageSize: 1,
          margin: 0
        }
      })
      qrCode.append(qrContainerRef.current)
    }
  }, [qrImage, hideBackgroundDots, imageScale, imageMargin, qrContainerRef, qrCode])

  return { qrImage, setQRImage, hideBackgroundDots, setHideBackgroundDots, imageScale, setImageScale, imageMargin, setImageMargin }
}
// #end-hook

// #hook useQRCodeDownload
/**
 * Hook para descargar el QR en diferentes formatos.
 */
export function useQRCodeDownload({ qrCode }: { qrCode: QRCodeStyling }) {
  const downloadQR = (extension: FileExtension) => {
    if (extension === 'svg') {
      qrCode.update({ type: 'svg' });
      qrCode.download({ name: 'qr-code', extension });
      qrCode.update({ type: 'canvas' });
    } else {
      qrCode.download({ name: 'qr-code', extension });
    }
  };

  return { downloadQR };
}
// #end-hook