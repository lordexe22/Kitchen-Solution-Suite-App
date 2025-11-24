// Copied/adapted hooks for QR Creator
import { useEffect, useRef, useState } from 'react'
import { qrCode } from './qrCreator.config'
import type { ColorType } from './qrCreator.d'

export const useQRContainerRef = () => {
  const qrContainerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = ''
      qrCode.append(qrContainerRef.current)
    }
  }, [])
  return { qrContainerRef }
}

export const useBasicOptions = ({ qrContainerRef }: { qrContainerRef: React.RefObject<HTMLDivElement | null> }) => {
  const [data, setData] = useState<string | undefined>(qrCode._options.data)
  const [width, setWidth] = useState<number>(qrCode._options.width)
  const [height, setHeight] = useState<number>(qrCode._options.height)
  const [margin, setMargin] = useState<number>(qrCode._options.margin)

  useEffect(() => {
    if (!qrContainerRef.current) return
    qrContainerRef.current.innerHTML = ''
    qrCode.update?.({ data, width, height, margin })
    qrCode.append(qrContainerRef.current)
  }, [data, width, height, margin, qrContainerRef])

  return { data, setData, width, setWidth, height, setHeight, margin, setMargin }
}

// Other hooks are large; for initial integration we provide minimal placeholders
export const useDotsOptions = ({ qrContainerRef }: any) => {
  const [dotType, setDotType] = useState<any>('square')
  const [colorType, setColorType] = useState<ColorType>('single')
  const [dotColor, setDotColor] = useState<string>('black')
  const [gradientType, setGradientType] = useState<any>('linear')
  const [gradientColors, setGradientColors] = useState<string[]>(['#000000', '#008000'])
  const [gradientRotation, setGradientRotation] = useState<number>(0)

  useEffect(() => {
    if (!qrContainerRef.current) return
    qrContainerRef.current.innerHTML = ''
    const dotsOptions: any = { type: dotType }
    if (colorType === 'single') {
      dotsOptions.color = dotColor
      dotsOptions.gradient = undefined
    }
    qrCode.update?.({ dotsOptions })
    qrCode.append(qrContainerRef.current)
  }, [dotType, colorType, dotColor, gradientType, gradientColors, gradientRotation, qrContainerRef])

  return { dotType, setDotType, colorType, setColorType, dotColor, setDotColor, gradientType, setGradientType, gradientColors, setGradientColors, gradientRotation, setGradientRotation }
}

export const useCornersSquareOptions = ({ qrContainerRef }: any) => {
  return { CSType: 'square', setCSType: () => {}, CSColorType: 'single', setCSColorType: () => {}, CSColor: '#000000', setCSColor: () => {}, CSGradientType: 'linear', setCSGradientType: () => {}, CSGradientColors: ['#000000', '#008000'], setCSGradientColors: () => {}, CSGradientRotation: 0, setCSGradientRotation: () => {} }
}

export const useCornersDotOptions = ({ qrContainerRef }: any) => {
  return { CDType: 'square', setCDType: () => {}, CDColorType: 'single', setCDColorType: () => {}, CDColor: '#000000', setCDColor: () => {}, CDGradientType: 'linear', setCDGradientType: () => {}, CDGradientColors: ['#000000', '#008000'], setCDGradientColors: () => {}, CDGradientRotation: 0, setCDGradientRotation: () => {} }
}

export const useBackgroundOptions = ({ qrContainerRef }: any) => {
  return { BGColorType: 'single', setBGColorType: () => {}, BGColor: '#ffffff', setBGColor: () => {}, BGGradientType: 'linear', setBGGradientType: () => {}, BGGradientColors: ['#ffffff', '#cccccc'], setBGGradientColors: () => {}, BGGradientRotation: 0, setBGGradientRotation: () => {} }
}

export const useImageOptions = ({ qrContainerRef }: any) => {
  const [qrImage, setQRImage] = useState<File | undefined>()
  const [hideBackgroundDots, setHideBackgroundDots] = useState(false)
  const [imageScale, setImageScale] = useState(1)
  const [imageMargin, setImageMargin] = useState(0)
  return { qrImage, setQRImage, hideBackgroundDots, setHideBackgroundDots, imageScale, setImageScale, imageMargin, setImageMargin }
}

export const useQROptions = ({ qrContainerRef }: any) => {
  const [typeNumber, setTypeNumber] = useState<number | null>(0)
  const [mode, setMode] = useState('Byte')
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M')
  return { typeNumber, setTypeNumber, mode, setMode, errorCorrectionLevel, setErrorCorrectionLevel }
}

export const useQRCodeDownload = () => {
  const downloadQR = (ext: string) => {
    qrCode.download({ name: 'qr-code', extension: ext })
  }
  return { downloadQR }
}
