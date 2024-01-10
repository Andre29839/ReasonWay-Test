import { calculateFullness } from "./fullness.js";

let blocks;
let containerSize = { width: 350, height: 300 };

const loadBlocksAndInitialize = async () => {
  try {
    const response = await fetch("./rectangles.json");
    blocks = await response.json();
    updateUI();
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
};

const updateUI = () => {
  containerSize = {
    width: window.innerWidth - 20,
    height: window.innerHeight,
  };
  const { fullness, blockCoordinates } = calculateFullness(
    blocks,
    containerSize,
    true
  );

  const containerElement = document.getElementById("container");
  containerElement.innerHTML = "";
  containerElement.style.overflow = "hidden";

  const fullnessElement = document.getElementById("fullness-info");
  fullnessElement.textContent = `Fullness: ${fullness.toFixed(2)}`;

  blockCoordinates.forEach((block) => {
    const blockElement = document.createElement("div");
    blockElement.className = "block";
    blockElement.style.width =
      block.rotation === 90
        ? block.bottom - block.top + "px"
        : block.right - block.left + "px";
    blockElement.style.height =
      block.rotation === 90
        ? block.right - block.left + "px"
        : block.bottom - block.top + "px";

    blockElement.style.top = block.top + "px";
    blockElement.style.left = block.left + "px";
    blockElement.style.background = block.color;
    blockElement.style.border = "1px solid black";
    blockElement.textContent = block.initialOrder;

    if (block.rotation === 90) {
      blockElement.style.transform = "rotate(90deg)";
    }

    containerElement.appendChild(blockElement);
  });
};

window.addEventListener("resize", updateUI);

loadBlocksAndInitialize();
