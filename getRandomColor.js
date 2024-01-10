const blockColor = {};

export const getRandomColor = (width, height) => {
  const sizeKey = `${width}_${height}`;

  if (blockColor[sizeKey]) {
    return blockColor[sizeKey];
  }

  const color = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;

  blockColor[sizeKey] = color;

  return color;
};
