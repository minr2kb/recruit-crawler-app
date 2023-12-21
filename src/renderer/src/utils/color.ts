/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
/* eslint-disable no-nested-ternary */
/**
 * Hex 또는 RGB, RGBA 색상 조절 함수
 * @param p - percentage: -1 ~ 1
 * @param c0 - color0
 * @param c1
 * @param l - log blending
 * @returns
 */

interface RGB {
  r: number
  g: number
  b: number
  a: number
}

export const pSBC = (p: number, c0: string, c1?: string, l?: boolean): string | null => {
  let r: number
  let g: number
  let b: number
  let h: boolean
  const i = parseInt
  const m = Math.round
  const a = typeof c1 === 'string'

  if (
    typeof p !== 'number' ||
    p < -1 ||
    p > 1 ||
    typeof c0 !== 'string' ||
    (c0[0] !== 'r' && c0[0] !== '#') ||
    (c1 && !a)
  )
    return null

  const pSBCr = (d: string): RGB | null => {
    let n = d.length
    let x: RGB = { r: 0, g: 0, b: 0, a: -1 }
    if (n > 9) {
      const [rr, gg, bb, aa] = d.split(',')
      n = aa.length
      if (n < 3 || n > 4) return null
      x = {
        r: i(rr[3] === 'a' ? rr.slice(5) : rr.slice(4)),
        g: i(gg),
        b: i(bb),
        a: aa ? parseFloat(aa) : -1
      }
    } else {
      if (n === 8 || n === 6 || n < 4) return null
      if (n < 6) d = `#${d[1]}${d[1]}${d[2]}${d[2]}${d[3]}${d[3]}${n > 4 ? d[4] + d[4] : ''}`

      const dd = i(d.slice(1), 16)
      if (n === 9 || n === 5)
        x = {
          r: (dd >> 24) & 255,
          g: (dd >> 16) & 255,
          b: (dd >> 8) & 255,
          a: m((dd & 255) / 0.255) / 1000
        }
      else x = { r: dd >> 16, g: (dd >> 8) & 255, b: dd & 255, a: -1 }
    }
    return x
  }

  h = c0.length > 9
  h = a ? (c1 && c1.length > 9 ? true : c1 === 'c' ? !h : h) : h
  const rgb0 = pSBCr(c0)
  const PP = p < 0
  const rgb1 =
    c1 && c1 !== 'c'
      ? pSBCr(c1)
      : PP
        ? { r: 0, g: 0, b: 0, a: -1 }
        : { r: 255, g: 255, b: 255, a: -1 }
  p = PP ? p * -1 : p
  const P: number = 1 - p

  if (!rgb0 || !rgb1) return null

  if (l) {
    r = m(P * rgb0.r + p * rgb1.r)
    g = m(P * rgb0.g + p * rgb1.g)
    b = m(P * rgb0.b + p * rgb1.b)
  } else {
    r = m((P * rgb0.r ** 2 + p * rgb1.r ** 2) ** 0.5)
    g = m((P * rgb0.g ** 2 + p * rgb1.g ** 2) ** 0.5)
    b = m((P * rgb0.b ** 2 + p * rgb1.b ** 2) ** 0.5)
  }

  const a0 = rgb0.a
  const a1 = rgb1.a
  const isAlpha = (typeof a0 === 'number' && a0 >= 0) || (typeof a1 === 'number' && a1 >= 0)
  const alpha = isAlpha
    ? typeof a0 !== 'number' || a0 < 0
      ? a1
      : typeof a1 !== 'number' || a1 < 0
        ? a0
        : a0 * P + a1 * p
    : 0

  if (h)
    return `rgb${isAlpha ? 'a(' : '('}${r},${g},${b}${isAlpha ? `,${m(alpha * 1000) / 1000}` : ''})`
  return `#${(4294967296 + r * 16777216 + g * 65536 + b * 256 + (isAlpha ? m(alpha * 255) : 0))
    .toString(16)
    .slice(1, isAlpha ? undefined : -2)}`
}

/**
 *
 * @param color - color hex code
 * @param amt - amount of shade: positive for lighter, negative for darker
 * @returns adjusted hex code string
 */

export const shadeHexColor = (color: string, amt: number): string => {
  color = color.replace(/^#/, '')
  if (color.length === 3) color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]

  let r = parseInt(color.substring(0, 2), 16)
  let g = parseInt(color.substring(2, 4), 16)
  let b = parseInt(color.substring(4, 6), 16)

  r = Math.min(r + amt, 255)
  g = Math.min(g + amt, 255)
  b = Math.min(b + amt, 255)

  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)

  const rr = r.toString(16).padStart(2, '0')
  const gg = g.toString(16).padStart(2, '0')
  const bb = b.toString(16).padStart(2, '0')

  return `#${rr}${gg}${bb}`
}
