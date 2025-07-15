import { useMemo, useState, useEffect } from "react";

/**
 * Custom hook to calculate the targetBlockWidth for XMasonry dynamically
 * based on window width and desired column counts at breakpoints.
 *
 * @param {number} totalModalHorizontalPadding - Total horizontal padding of the container
 * @param {number} columnGap - The gap between masonry columns
 * @param {number} effectiveMaxColumns - The maxColumns prop passed to XMasonry
 * @param {Array<{width: number, columns: number}>} customBreakpoints - Array of objects defining breakpoints and desired column counts
 * @returns {number} The calculated targetBlockWidth for XMasonry
 */
export const useMasonryTargetBlockWidth = (
  totalModalHorizontalPadding,
  columnGap,
  effectiveMaxColumns,
  customBreakpoints // Allows passing specific breakpoints
) => {
  const [currentWindowWidth, setCurrentWindowWidth] = useState(
    window.innerWidth
  );

  // Effect to update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setCurrentWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateWidth = useMemo(() => {
    // Default breakpoints if not provided, or merge with custom ones
    const defaultBreakpoints = [
      { width: 0, columns: 1 },
      { width: 640, columns: 2 },
      { width: 768, columns: 3 },
      { width: 1024, columns: 4 },
      { width: 1440, columns: 3 }, // Example: dropping to 3 columns for very wide screens
    ];

    const breakpoints =
      customBreakpoints && customBreakpoints.length > 0
        ? customBreakpoints.sort((a, b) => a.width - b.width) // Ensure breakpoints are sorted
        : defaultBreakpoints;

    // Find the current desired column count based on window width
    let desiredColumns = 1;
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      if (currentWindowWidth >= breakpoints[i].width) {
        desiredColumns = breakpoints[i].columns;
        break;
      }
    }

    // Ensure we don't exceed maxColumns for XMasonry
    desiredColumns = Math.min(desiredColumns, effectiveMaxColumns);

    // Calculate the ideal targetBlockWidth
    if (desiredColumns === 0) return 1;

    const availableWidthForMasonry =
      currentWindowWidth - totalModalHorizontalPadding;
    const totalGapSpace = (desiredColumns - 1) * columnGap;
    const widthPerColumn =
      (availableWidthForMasonry - totalGapSpace) / desiredColumns;

    const fudgeFactor = 10;
    return Math.max(170, widthPerColumn - fudgeFactor); // Ensure minimum block width
  }, [
    currentWindowWidth,
    totalModalHorizontalPadding,
    columnGap,
    effectiveMaxColumns,
    customBreakpoints,
  ]); // Dependencies for useMemo

  return calculateWidth;
};
