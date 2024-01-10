import { getRandomColor } from "./getRandomColor.js";

export const calculateFullness = (
  blocks,
  container,
  rotateOnResize = false
) => {
  const sortedBlocks = blocks
    .slice()
    .sort((a, b) => b.width * b.height - a.width * a.height);
  const blockCoordinates = [];

  let containerFull = false;

  const blocksFit = sortedBlocks.every((block) => {
    return (
      (block.width <= container.width && block.height <= container.height) ||
      (block.height <= container.width && block.width <= container.height)
    );
  });

  if (!blocksFit) {
    return { fullness: 0, blockCoordinates: [] };
  }

  sortedBlocks.forEach((block, index) => {
    let rotation = 0;
    let rotatedWidth = block.width;
    let rotatedHeight = block.height;

    if (
      rotateOnResize &&
      (block.width > container.width || block.height > container.height)
    ) {
      [rotatedWidth, rotatedHeight] = [block.height, block.width];
      rotation = 90;
    }

    let fits = false;
    let bestSpot = null;

    for (let y = 0; y <= container.height - rotatedHeight; y++) {
      for (let x = 0; x <= container.width - rotatedWidth; x++) {
        fits = true;

        for (const placedBlock of blockCoordinates) {
          if (
            !(
              x + rotatedWidth <= placedBlock.left ||
              x >= placedBlock.right ||
              y + rotatedHeight <= placedBlock.top ||
              y >= placedBlock.bottom
            )
          ) {
            fits = false;
            break;
          }
        }

        if (fits) {
          bestSpot = { x, y };
          break;
        }
      }

      if (fits) {
        break;
      }
    }

    if (bestSpot) {
      blockCoordinates.push({
        top: bestSpot.y + (bestSpot.y > 0 ? 1 : 0),
        left: bestSpot.x + (bestSpot.x > 0 ? 1 : 0),
        right: bestSpot.x + rotatedWidth + (bestSpot.x > 0 ? 1 : 0),
        bottom: bestSpot.y + rotatedHeight + (bestSpot.y > 0 ? 1 : 0),
        initialOrder: index,
        rotation: rotation,
        color: getRandomColor(rotatedWidth, rotatedHeight),
      });
    } else {
      containerFull = true;
    }
  });

  const totalArea = container.width * container.height;
  const filledArea = blockCoordinates.reduce(
    (acc, block) =>
      acc + (block.right - block.left) * (block.bottom - block.top),
    0
  );
  const emptyArea = totalArea - filledArea;

  const fullness = 1 - emptyArea / (emptyArea + totalArea);

  return { fullness, blockCoordinates };
};
