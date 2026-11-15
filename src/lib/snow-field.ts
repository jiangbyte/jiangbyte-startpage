/**
 * 全页雪花飘落场（博客封面 PetalField / 简历 SnowField 的 Vite 版）。
 */

import { createSnowflakeSprites, SNOWFLAKE_VIEWBOX } from './snowflake'

type Flake = {
  x: number
  y: number
  fall: number
  size: number
  depth: number
  rotation: number
  spin: number
  flip: number
  flipSpeed: number
  sway: number
  swaySpeed: number
  swayAmp: number
  sprite: number
  alpha: number
  life: number
}

const MAX_DPR = 2
const SPRITE_UNIT = 3
const BOTTOM_FADE = 100

const random = (min: number, max: number) => min + Math.random() * (max - min)

export class SnowField {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private sprites: HTMLCanvasElement[] = []
  private flakes: Flake[] = []
  private width = 0
  private height = 0
  private dpr = 1
  private frame = 0
  private lastTime = 0
  private clock = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    this.ctx = ctx
  }

  get running(): boolean {
    return this.frame !== 0
  }

  /** 按视口尺寸与密度分配雪花数量 */
  resize(width: number, height: number): void {
    if (width === this.width && height === this.height) return
    const firstLayout = this.width === 0
    this.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    this.width = width
    this.height = height
    this.canvas.width = Math.round(width * this.dpr)
    this.canvas.height = Math.round(height * this.dpr)
    if (this.sprites.length === 0) this.sprites = createSnowflakeSprites(SPRITE_UNIT * this.dpr)

    // 1. 按面积估密度，全页略疏于封面，避免抢内容
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const density = (width * height) / (coarse ? 52000 : 40000)
    const target = Math.round(Math.min(28, Math.max(10, density)))
    while (this.flakes.length < target) this.flakes.push(this.spawn(firstLayout))
    this.flakes.length = target
  }

  start(): void {
    if (this.frame !== 0) return
    this.lastTime = performance.now()
    this.frame = requestAnimationFrame(this.tick)
  }

  stop(): void {
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.clear()
  }

  clear(): void {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private spawn(scatter: boolean): Flake {
    const depth = random(0.45, 1)
    return {
      x: random(-40, this.width + 40),
      y: scatter ? random(-40, this.height * 0.9) : random(-80, -20),
      fall: random(18, 36),
      size: random(0.7, 1.15) * (0.5 + depth * 0.5) * (24 / 64),
      depth,
      rotation: random(0, Math.PI * 2),
      spin: random(-0.9, 0.9),
      flip: random(0, Math.PI * 2),
      flipSpeed: random(1, 2.2),
      sway: random(0, Math.PI * 2),
      swaySpeed: random(0.5, 1.2),
      swayAmp: random(8, 22),
      sprite: Math.floor(random(0, this.sprites.length || 4)),
      alpha: random(0.45, 0.85) * (0.55 + depth * 0.45),
      life: scatter ? random(0.2, 1) : 0,
    }
  }

  private readonly tick = (now: number) => {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000)
    this.lastTime = now
    this.clock += dt
    this.update(dt)
    this.draw()
    this.frame = requestAnimationFrame(this.tick)
  }

  private update(dt: number): void {
    const breeze = 12 + Math.sin(this.clock * 0.13) * 8 + Math.sin(this.clock * 0.37) * 3
    for (const flake of this.flakes) {
      flake.sway += flake.swaySpeed * dt
      flake.flip += flake.flipSpeed * dt
      flake.rotation += flake.spin * dt
      flake.x += (breeze * flake.depth + Math.cos(flake.sway) * flake.swayAmp) * dt
      flake.y += (flake.fall * flake.depth + Math.sin(flake.sway * 0.5) * 5) * dt
      flake.life = Math.min(1, flake.life + dt / 1.4)

      if (flake.y > this.height + 30 || flake.x > this.width + 60 || flake.x < -80) {
        Object.assign(flake, this.spawn(false))
        flake.x = random(-60, this.width * 0.9)
      }
    }
  }

  private draw(): void {
    const { ctx, dpr } = this
    this.clear()
    for (const flake of this.flakes) {
      const sprite = this.sprites[flake.sprite]
      if (!sprite) continue
      const fadeOut = Math.min(1, Math.max(0, (this.height - flake.y) / BOTTOM_FADE))
      const alpha = flake.alpha * flake.life * fadeOut
      if (alpha <= 0.01) continue
      const squash = 0.25 + 0.75 * Math.abs(Math.cos(flake.flip))
      const scale = flake.size / SPRITE_UNIT
      const cos = Math.cos(flake.rotation)
      const sin = Math.sin(flake.rotation)
      ctx.globalAlpha = alpha
      ctx.setTransform(
        cos * scale,
        sin * scale,
        -sin * scale * squash,
        cos * scale * squash,
        flake.x * dpr,
        flake.y * dpr,
      )
      ctx.drawImage(
        sprite,
        (-SNOWFLAKE_VIEWBOX.width * SPRITE_UNIT * dpr) / 2,
        (-SNOWFLAKE_VIEWBOX.height * SPRITE_UNIT * dpr) / 2,
      )
    }
    ctx.globalAlpha = 1
  }
}
