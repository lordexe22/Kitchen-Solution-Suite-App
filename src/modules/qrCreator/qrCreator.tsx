// src/modules/qrCreator/qrCreator.tsx

import { useEffect } from 'react'
import style from './qrCreator.module.css'
import { Accordion } from '../../modules/accordion/Accordion'
import { 
  useQRInstance,
  useQRContainerRef, 
  useBasicOptions, 
  useDotsOptions, 
  useCornersSquareOptions, 
  useCornersDotOptions,
  useBackgroundOptions,
  useImageOptions,
  useQRCodeDownload
} from './qrCreator.hooks'
import type { 
  DotType, 
  GradientType
} from 'qr-code-styling'
import type { ColorType } from './qrCreator.d'
import { enabledConfigOptions } from './qrCreator.config'

/**
 * Props del componente QRCreator.
 * 
 * @property {string} data - URL o texto para el QR (controlado externamente)
 */
interface QRCreatorProps {
  data?: string;
}

const QRCreator = ({ data: externalData }: QRCreatorProps) => {
  // Permitir múltiples acordeones abiertos simultáneamente (sin estado global de apertura)
  // #hook useQRInstance
  const { qrCode } = useQRInstance();
  // #end-hook
  
  // #hook useQRContainerRef
  const { qrContainerRef } = useQRContainerRef({ qrCode });
  // #end-hook
  
  // #hook useBasicOptions
  const {
    data, setData,
    width, setWidth,
    height, setHeight,
    margin, setMargin
  } = useBasicOptions({ qrContainerRef, qrCode });
  // #end-hook
  
  // #hook useDotsOptions
  const {
    dotType, setDotType,
    colorType, setColorType,
    dotColor, setDotColor,
    gradientType, setGradientType,
    gradientColors, setGradientColors,
    gradientRotation, setGradientRotation
  } = useDotsOptions({ qrContainerRef, qrCode });
  // #end-hook
  
  // #hook useCornersSquareOptions
  const {
    CSType, setCSType, 
    CSColorType, setCSColorType, 
    CSColor, setCSColor, 
    CSGradientType, setCSGradientType, 
    CSGradientColors, setCSGradientColors,
    CSGradientRotation, setCSGradientRotation
  } = useCornersSquareOptions({ qrContainerRef, qrCode })
  // #end-hook
  
  // #hook useCornersDotOptions
  const {
    CDType, setCDType,
    CDColorType, setCDColorType,
    CDColor, setCDColor,
    CDGradientType, setCDGradientType,
    CDGradientColors, setCDGradientColors,
    CDGradientRotation, setCDGradientRotation
  } = useCornersDotOptions({ qrContainerRef, qrCode })
  // #end-hook
  
  // #hook useBackgroundOptions
  const {
    BGColorType, setBGColorType,
    BGColor, setBGColor,
    BGGradientType, setBGGradientType,
    BGGradientColors, setBGGradientColors,
    BGGradientRotation, setBGGradientRotation
  } = useBackgroundOptions({ qrContainerRef, qrCode })
  // #end-hook
  
  // #hook useImageOptions
  const {
    qrImage, setQRImage,
    hideBackgroundDots, setHideBackgroundDots,
    imageScale, setImageScale,
    imageMargin, setImageMargin
  } = useImageOptions({ qrContainerRef, qrCode })
  // #end-hook
  
  // #hook useQRCodeDownload
  const { downloadQR } = useQRCodeDownload({ qrCode });
  // #end-hook

  // #effect - Sincronizar data externa con el estado interno
  useEffect(() => {
    if (externalData !== undefined && externalData !== data) {
      setData(externalData);
    }
  }, [externalData, data, setData]);
  // #end-effect

  // #section return
  return(
    <div className={style['qr-creator-container']}>
      {/* #section qr-options */}
      <div className={style['qr-options']}>
        <div className={style['qr-options-scroll']}>
        {/* #section basic-options */}
        {enabledConfigOptions.basicOptions &&
          <Accordion
            id="qr-basic-options"
            header={{ title: 'Basic options', indicator: { position: 'end', rotationDegrees: 90 } }}
            keepContentMounted
            transitionDurationMs={150}
          >
            <div className={style['section-container']}>
              {/* #section Width */}
              <span className={style['input-label']}>Width</span>
              <div className={style['input-wrapper']}>
                <input 
                  type="range" 
                  value={width}
                  min={100}
                  max={500}
                  onChange={(e)=>{setWidth(Number(e.target.value))}}
                />
                <span className={style['input-value']}>{width} px</span>
              </div>
              {/* #end-section */}
              {/* #section Height */}
              <span className={style['input-label']}>Height</span>
              <div className={style['input-wrapper']}>
                <input 
                  type="range" 
                  value={height}
                  min={100}
                  max={500}
                  onChange={(e)=>{setHeight(Number(e.target.value))}}
                />
                <span className={style['input-value']}>{height} px</span>
              </div>
              {/* #end-section */}
              {/* #section Margin */}
              <span className={style['input-label']}>Margin</span>
              <div className={style['input-wrapper']}>
                <input 
                  type="range"
                  value={margin}
                  min={0}
                  max={100}
                  onChange={(e)=>{setMargin(Number(e.target.value))}}                
                />
                <span className={style['input-value']}>{margin} px</span>
              </div>
              {/* #end-section */}
            </div>
          </Accordion>
        }
        {/* #end-section */}
        {/* #section dots-options */}
        {enabledConfigOptions.dotsOptions &&
          <Accordion
            id="qr-dots-options"
            header={{ title: 'Dots options', indicator: { position: 'end', rotationDegrees: 90 } }}
            keepContentMounted
            transitionDurationMs={150}
          >
            <div className={style['section-container']}>
              {/* #section dot-type */}
              <span className={style['input-label']}>Dot Type</span>
              <div className={style['input-wrapper']}>
                <select
                  onChange={(e) => setDotType(e.target.value as DotType)}
                  value={dotType}
                >
                  <option value="dots">dots</option>
                  <option value="rounded">rounded</option>
                  <option value="classy">classy</option>
                  <option value="classy-rounded">classy-rounded</option>
                  <option value="square">square</option>
                  <option value="extra-rounded">extra-rounded</option>
                </select>
              </div>
              {/* #end-section */}
              {/* #section color-type */}
              <span className={style['input-label']}>Color Type</span>
              <div className={style['input-wrapper']}>
                <select
                  onChange={(e) => setColorType(e.target.value as ColorType)}
                  value={colorType}
                >
                  <option value="single">Single color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              {/* #end-section */}
              {/* #section single-color */}
              {colorType === 'single' &&
                <>
                  <span className={style['input-label']}>Dot Color</span>
                  <div className={style['input-wrapper']}>
                    <input 
                      type="color" 
                      value={dotColor}
                      onChange={(e) => setDotColor(e.target.value)}
                    />
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-type */}
              {colorType === 'gradient' &&
                <>
                  <span className={style['input-label']}>Gradient Type</span>
                  <div className={style['input-wrapper']}>
                    <select
                      onChange={(e) => setGradientType(e.target.value as GradientType)}
                      value={gradientType}
                    >
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-colors */}
              {colorType === 'gradient' && 
                <>
                  <span className={style['input-label']}>Gradient Colors</span>
                  <div className={style['input-wrapper']}>
                    {gradientColors.map((color, index) => (
                      <input 
                        key={index}
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...gradientColors]
                          newColors[index] = e.target.value
                          setGradientColors(newColors)
                        }}
                      />
                    ))}
                    {/* Botón para intercambiar colores */}
                    <button
                      type="button"
                      onClick={() => setGradientColors([...gradientColors].reverse())}
                      className={style['swap-button']}
                    >
                      Swap Colors
                    </button>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-rotation */}
              {colorType === 'gradient' && gradientType === 'linear' &&
                <>
                  <span className={style['input-label']}>Gradient Rotation</span>
                  <div className={style['input-wrapper']}>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={gradientRotation}
                      onChange={(e) => setGradientRotation(Number(e.target.value))}
                    />
                    <span className={style['input-value']}>{gradientRotation}°</span>
                  </div>
                </>
              }
              {/* #end-section */}
            </div>
          </Accordion>
        }
        {/* #end-section */}
        {/* #section corners-square-options */}  
        {enabledConfigOptions.cornerSquareOptions &&
          <Accordion
            id="qr-corners-square-options"
            header={{ title: 'Corners Square Options', indicator: { position: 'end', rotationDegrees: 90 } }}
            keepContentMounted
            transitionDurationMs={150}
          >
            <div className={style['section-container']}>
              {/* #section Corners Square Type */}
              <span className={style['input-label']}>Corners Square Type</span>
              <div className={style['input-wrapper']}>
                <select
                  onChange={(e) => setCSType(e.target.value as typeof CSType)}
                  value={CSType}
                >
                  <option value="none">none</option>
                  <option value="dot">dot</option>
                  <option value="square">square</option>
                  <option value="extra-rounded">extra-rounded</option>
                </select>
              </div>
              {/* #end-section */}
              {/* #section color-type */}
              <span className={style['input-label']}>Color Type</span>
              <div className={style['input-wrapper']}>
                <select
                  onChange={(e) => setCSColorType(e.target.value as typeof CSColorType)}
                  value={CSColorType}
                >
                  <option value="single">Single color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              {/* #end-section */}
              {/* #section single-color */}
              {CSColorType === 'single' &&
                <>
                  <span className={style['input-label']}>Color</span>
                  <div className={style['input-wrapper']}>
                    <input 
                      type="color" 
                      value={CSColor}
                      onChange={(e) => setCSColor(e.target.value)}
                    />
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-type */}
              {CSColorType === 'gradient' &&
                <>
                  <span className={style['input-label']}>Gradient Type</span>
                  <div className={style['input-wrapper']}>
                    <select
                      onChange={(e) => setCSGradientType(e.target.value as typeof CSGradientType)}
                      value={CSGradientType}
                    >
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-colors */}
              {CSColorType === 'gradient' && 
                <>
                  <span className={style['input-label']}>Gradient Colors</span>
                  <div className={style['input-wrapper']}>
                    {CSGradientColors.map((color, index) => (
                      <input 
                        key={index}
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...CSGradientColors]
                          newColors[index] = e.target.value
                          setCSGradientColors(newColors)
                        }}
                      />
                    ))}
                    {/* Botón para intercambiar colores */}
                    <button
                      type="button"
                      onClick={() => setCSGradientColors([...CSGradientColors].reverse())}
                      className={style['swap-button']}
                    >
                      Swap Colors
                    </button>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-rotation */}
              {CSColorType === 'gradient' && CSGradientType === 'linear' &&
                <>
                  <span className={style['input-label']}>Gradient Rotation</span>
                  <div className={style['input-wrapper']}>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={CSGradientRotation}
                      onChange={(e) => setCSGradientRotation(Number(e.target.value))}
                    />
                    <span className={style['input-value']}>{CSGradientRotation}°</span>
                  </div>
                </>
              }
              {/* #end-section */}
            </div>
          </Accordion>
        }      
        {/* #end-section */}
        {/* #section corners-dot-options */}   
        {enabledConfigOptions.cornersDotOptions && 
          <Accordion
            id="qr-corners-dot-options"
            header={{ title: 'Corners Dot Options', indicator: { position: 'end', rotationDegrees: 90 } }}
            keepContentMounted
            transitionDurationMs={150}
          >
            <div className={style['section-container']}>
              {/* #section corners-dot-type */}
              <span className={style['input-label']}>Corners Dot Type</span>
              <div className={style['input-wrapper']}>
                <select
                  onChange={(e) => setCDType(e.target.value as typeof CDType)}
                  value={CDType}
                >
                  <option value="none">none</option>
                  <option value="dot">dot</option>
                  <option value="square">square</option>
                </select>
              </div>
              {/* #end-section */}
              {/* #section color-type */}
              <span className={style['input-label']}>Color Type</span>
              <div className={style['input-wrapper']}>
                <select
                  onChange={(e) => setCDColorType(e.target.value as typeof CDColorType)}
                  value={CDColorType}
                >
                  <option value="single">Single color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              {/* #end-section */}
              {/* #section single-color */}
              {CDColorType === 'single' &&
                <>
                  <span className={style['input-label']}>Color</span>
                  <div className={style['input-wrapper']}>
                    <input 
                      type="color" 
                      value={CDColor}
                      onChange={(e) => setCDColor(e.target.value)}
                    />
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-type */}
              {CDColorType === 'gradient' &&
                <>
                  <span className={style['input-label']}>Gradient Type</span>
                  <div className={style['input-wrapper']}>
                    <select
                      onChange={(e) => setCDGradientType(e.target.value as typeof CDGradientType)}
                      value={CDGradientType}
                    >
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-colors */}
              {CDColorType === 'gradient' && 
                <>
                  <span className={style['input-label']}>Gradient Colors</span>
                  <div className={style['input-wrapper']}>
                    {CDGradientColors.map((color, index) => (
                      <input 
                        key={index}
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...CDGradientColors]
                          newColors[index] = e.target.value
                          setCDGradientColors(newColors)
                        }}
                      />
                    ))}
                    {/* Botón para intercambiar colores */}
                    <button
                      type="button"
                      onClick={() => setCDGradientColors([...CDGradientColors].reverse())}
                      className={style['swap-button']}
                    >
                      Swap Colors
                    </button>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section gradient-rotation */}
              {CDColorType === 'gradient' && CDGradientType === 'linear' &&
                <>
                  <span className={style['input-label']}>Gradient Rotation</span>
                  <div className={style['input-wrapper']}>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={CDGradientRotation}
                      onChange={(e) => setCDGradientRotation(Number(e.target.value))}
                    />
                    <span className={style['input-value']}>{CDGradientRotation}°</span>
                  </div>
                </>
              }
              {/* #end-section */}
            </div>
          </Accordion>
        }      
        {/* #end-section */}
        {/* #section background-options */}
        {enabledConfigOptions.backgroundOptions &&
          <Accordion
            id="qr-background-options"
            header={{ title: 'Background Options', indicator: { position: 'end', rotationDegrees: 90 } }}
            keepContentMounted
            transitionDurationMs={150}
          >
            <div className={style['section-container']}>
              {/* #section background-color-type */}
              <span className={style['input-label']}>Color Type</span>
              <div className={style['input-wrapper']}>
                <select
                  onChange={(e) => setBGColorType(e.target.value as typeof BGColorType)}
                  value={BGColorType}
                >
                  <option value="single">Single color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              {/* #end-section */}
              {/* #section background-single-color */}
              {BGColorType === 'single' &&
                <>
                  <span className={style['input-label']}>Background Color</span>
                  <div className={style['input-wrapper']}>
                    <input 
                      type="color" 
                      value={BGColor}
                      onChange={(e) => setBGColor(e.target.value)}
                    />
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section background-gradient-type */}
              {BGColorType === 'gradient' &&
                <>
                  <span className={style['input-label']}>Gradient Type</span>
                  <div className={style['input-wrapper']}>
                    <select
                      onChange={(e) => setBGGradientType(e.target.value as typeof BGGradientType)}
                      value={BGGradientType}
                    >
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section background-gradient-colors */}
              {BGColorType === 'gradient' &&
                <>
                  <span className={style['input-label']}>Gradient Colors</span>
                  <div className={style['input-wrapper']}>
                    {BGGradientColors.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...BGGradientColors]
                          newColors[index] = e.target.value
                          setBGGradientColors(newColors)
                        }}
                      />
                    ))}
                    {/* Botón para intercambiar colores */}
                    <button
                      type="button"
                      onClick={() => setBGGradientColors([...BGGradientColors].reverse())}
                      className={style['swap-button']}
                    >
                      Swap Colors
                    </button>
                  </div>
                </>
              }
              {/* #end-section */}
              {/* #section background-gradient-rotation */}
              {BGColorType === 'gradient' && BGGradientType === 'linear' &&
                <>
                  <span className={style['input-label']}>Gradient Rotation</span>
                  <div className={style['input-wrapper']}>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={BGGradientRotation}
                      onChange={(e) => setBGGradientRotation(Number(e.target.value))}
                    />
                    <span className={style['input-value']}>{BGGradientRotation}°</span>
                  </div>
                </>
              }
              {/* #end-section */}
            </div>
          </Accordion>
        }
        {/* #end-section */}
        {/* #section image-options */}
        {enabledConfigOptions.imageOptions && 
          <Accordion
            id="qr-image-options"
            header={{ title: 'Image Options', indicator: { position: 'end', rotationDegrees: 90 } }}
            keepContentMounted
            transitionDurationMs={150}
          >
            <div className={style['section-container']}>
              {/* #section upload-image */}
            <span className={style['input-label']}>Upload Image</span>
            <div className={style['input-wrapper']}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setQRImage(file)
                }}
              />
              {qrImage && (
                <button
                  type="button"
                  className={style['remove-button']}
                  onClick={() => setQRImage(undefined)}
                >
                  Remove
                </button>
              )}
            </div>
            {/* #end-section */}
              {/* #section hide-background-dots */}
              <span className={style['input-label']}>Hide Background Dots</span>
              <div className={style['input-wrapper']} style={{justifyContent: 'flex-start'}}>
                <input
                  style={{width: 'auto'}}
                  type="checkbox"
                  checked={hideBackgroundDots}
                  onChange={(e) => setHideBackgroundDots(e.target.checked)}
                />
              </div>
              {/* #end-section */}
              {/* #section image-scale */}
              <span className={style['input-label']}>Image Scale</span>
              <div className={style['input-wrapper']}>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={imageScale}
                  onChange={(e) => setImageScale(Number(e.target.value))}
                />
                <span className={style['input-value']}>{Math.round(imageScale * 100)}%</span>
              </div>
              {/* #end-section */}
              {/* #section image-margin */}
              <span className={style['input-label']}>Image Margin</span>
              <div className={style['input-wrapper']}>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={imageMargin}
                  onChange={(e) => setImageMargin(Number(e.target.value))}
                />
                <span className={style['input-value']}>{imageMargin}px</span>
              </div>
              {/* #end-section */}
            </div>
          </Accordion>
        }
        {/* #end-section */}
        </div>
      </div>
      {/* #end-section */}
      {/* #section qr-render */}
      {/* Contenedor del QR */}

      <div className={style['qr-render']} >
        <div ref={qrContainerRef} className={style['qr-container']}></div>
        {/* Botones de descarga, solo si hay QR generado */}
        <div className={style['qr-download-buttons']}>
          <button onClick={() => downloadQR('png')}>Descargar PNG</button>
          <button onClick={() => downloadQR('svg')}>Descargar SVG</button>
          <button onClick={() => downloadQR('jpeg')}>Descargar JPEG</button>
          <button onClick={() => downloadQR('webp')}>Descargar WEBP</button>
        </div>
      </div>


      {/* #end-section */}
    </div>
  )
  // #end-section

}
export default QRCreator