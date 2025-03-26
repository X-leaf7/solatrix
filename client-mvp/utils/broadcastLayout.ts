import { Parser } from "expr-eval"

/**
 * Calculate scaled coordinates to fit an item within a container while maintaining aspect ratio
 * @param itemWidth - The width of the item to scale
 * @param itemHeight - The height of the item to scale
 * @param containerWidth - The width of the container
 * @param containerHeight - The height of the container
 * @returns An object with the scaled coordinates and dimensions
 */
export function calcScaledCoords(
  itemWidth: number,
  itemHeight: number,
  containerWidth: number,
  containerHeight: number,
): { x: number; y: number; w: number; h: number } {
  // get the scale
  const scale = Math.max(containerWidth / itemWidth, containerHeight / itemHeight)
  // get the top left position of the image
  const x = containerWidth / 2 - (itemWidth / 2) * scale
  const y = containerHeight / 2 - (itemHeight / 2) * scale
  return { x, y, w: itemWidth * scale, h: itemHeight * scale }
}

/**
 * Interface for dimensions object
 */
interface Dimensions {
  x: number | string
  y: number | string
  z?: number | string
  w: number | string
  h: number | string
  visible?: boolean
  [key: string]: any
}

/**
 * Interface for canvas size
 */
interface CanvasSize {
  width: number
  height: number
}

/**
 * Interface for formatted position
 */
interface FormattedPosition {
  x: number
  y: number
  index: number
  width: number
  height: number
}

/**
 * Format position from dimensions using expr-eval Parser
 * @param params - Object containing dimensions and baseCanvasSize
 * @returns Formatted position object
 */
export function formatPositionFromDimensions({
  dimensions,
  baseCanvasSize,
}: {
  dimensions: Dimensions
  baseCanvasSize: CanvasSize
}): FormattedPosition {
  const parser = new Parser()
  const dimensionsArr = Object.entries(dimensions)

  const parserConstants: Record<string, number> = {
    CANVAS_WIDTH: baseCanvasSize.width,
    CANVAS_HEIGHT: baseCanvasSize.height,
  }

  parserConstants.LAYER_WIDTH = parser.evaluate(dimensions.w.toString(), parserConstants)

  parserConstants.LAYER_HEIGHT = parser.evaluate(dimensions.h.toString(), parserConstants)

  const formattedDimensions: Record<string, number> = {}

  for (const [property, dimension] of dimensionsArr) {
    if (property === "visible") continue

    const formattedDimension = parser.evaluate(dimension.toString(), parserConstants)
    formattedDimensions[property] = formattedDimension
  }

  return {
    x: formattedDimensions.x,
    y: formattedDimensions.y,
    index: formattedDimensions.z,
    width: formattedDimensions.w,
    height: formattedDimensions.h,
  }
}

/**
 * Compare two arrays and return elements that are in the first array but not in the second
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Array of elements that are in arr1 but not in arr2
 */
export function compareArrays<T>(arr1: T[], arr2: T[]): T[] {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  const difference = Array.from(set1).filter((x) => !set2.has(x))

  return difference
}

// Export interfaces for use in other files
export type { Dimensions, CanvasSize, FormattedPosition }

