import { useEffect, useRef } from 'react'
import { SnowField } from '../lib/snow-field'

/**
 * 全页雪花飘落：默认开启；系统「减少动态效果」时关闭。
 */
export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let field: SnowField | null = null

    const syncSize = () => {
      if (!field) return
      field.resize(window.innerWidth, window.innerHeight)
    }

    // 1. 开启：建场、同步尺寸并淡入
    const start = () => {
      if (!field) field = new SnowField(canvas)
      syncSize()
      field.start()
      canvas.dataset.active = 'true'
    }

    // 2. 关闭：停动画并淡出
    const stop = () => {
      field?.stop()
      delete canvas.dataset.active
    }

    const apply = () => {
      if (reduceMotion.matches) stop()
      else start()
    }

    apply()

    const onResize = () => {
      if (field?.running) syncSize()
    }
    window.addEventListener('resize', onResize)
    reduceMotion.addEventListener('change', apply)

    return () => {
      window.removeEventListener('resize', onResize)
      reduceMotion.removeEventListener('change', apply)
      stop()
    }
  }, [])

  return (
    <canvas
      id="site-snowfall"
      ref={canvasRef}
      className="site-snowfall"
      aria-hidden="true"
    />
  )
}
