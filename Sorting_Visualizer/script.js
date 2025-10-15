const barsContainer = document.getElementById("bars-container");
const sizeInput = document.getElementById("size");
const speedInput = document.getElementById("speed");
const algorithmSelect = document.getElementById("algorithm");
const generateBtn = document.getElementById("generate");
const sortBtn = document.getElementById("sort");
const algoText = document.getElementById("algo-text");

let array = [];
let delay = 100;

generateBtn.addEventListener("click", generateArray);
sizeInput.addEventListener("input", generateArray);
speedInput.addEventListener("input", e => delay = e.target.value);
sortBtn.addEventListener("click", sort);

generateArray();

function generateArray() {
  barsContainer.innerHTML = "";
  const size = sizeInput.value;
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 20);
  array.forEach(value => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    bar.style.width = `${600 / size}px`;
    barsContainer.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateExplanation(text) {
  algoText.innerText = text;
}

async function sort() {
  const algo = algorithmSelect.value;
  updateExplanation("Sorting started...");
  switch (algo) {
    case "bubble": await bubbleSort(); break;
    case "selection": await selectionSort(); break;
    case "insertion": await insertionSort(); break;
    case "merge": await mergeSort(); break;
    case "quick": await quickSort(0, array.length - 1); break;
    case "heap": await heapSort(); break;
  }
  updateExplanation("✅ Sorting completed!");
}

// --- Algorithms ---
function updateBar(bar, height, active = false) {
  bar.style.height = `${height}px`;
  bar.classList.toggle("active", active);
}

async function bubbleSort() {
  updateExplanation("Bubble Sort: Repeatedly swap adjacent elements if they are in the wrong order.");
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      updateBar(bars[j], array[j], true);
      updateBar(bars[j + 1], array[j + 1], true);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateBar(bars[j], array[j]);
        updateBar(bars[j + 1], array[j + 1]);
      }
      await sleep(delay);
      updateBar(bars[j], array[j], false);
      updateBar(bars[j + 1], array[j + 1], false);
    }
  }
}

async function selectionSort() {
  updateExplanation("Selection Sort: Find the smallest element and place it at the beginning.");
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      updateBar(bars[j], array[j], true);
      if (array[j] < array[min]) min = j;
      await sleep(delay);
      updateBar(bars[j], array[j], false);
    }
    [array[i], array[min]] = [array[min], array[i]];
    updateBar(bars[i], array[i]);
    updateBar(bars[min], array[min]);
  }
}

async function insertionSort() {
  updateExplanation("Insertion Sort: Insert elements one by one into the sorted portion of the array.");
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      updateBar(bars[j + 1], array[j + 1], true);
      await sleep(delay);
      updateBar(bars[j + 1], array[j + 1], false);
      j--;
    }
    array[j + 1] = key;
    updateBar(bars[j + 1], key);
  }
}

async function mergeSort(l = 0, r = array.length - 1) {
  updateExplanation("Merge Sort: Divide the array into halves, sort them and then merge.");
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  await mergeSort(l, m);
  await mergeSort(m + 1, r);
  await merge(l, m, r);
}

async function merge(l, m, r) {
  const left = array.slice(l, m + 1);
  const right = array.slice(m + 1, r + 1);
  const bars = document.querySelectorAll(".bar");
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    updateBar(bars[k], array[k], true);
    if (left[i] <= right[j]) array[k] = left[i++];
    else array[k] = right[j++];
    updateBar(bars[k], array[k]);
    await sleep(delay);
    updateBar(bars[k], array[k], false);
    k++;
  }

  while (i < left.length) {
    array[k] = left[i++];
    updateBar(bars[k], array[k]);
    await sleep(delay);
    k++;
  }
  while (j < right.length) {
    array[k] = right[j++];
    updateBar(bars[k], array[k]);
    await sleep(delay);
    k++;
  }
}

async function quickSort(low, high) {
  updateExplanation("Quick Sort: Pick a pivot and partition the array around it.");
  if (low < high) {
    const pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  const bars = document.querySelectorAll(".bar");
  let i = low - 1;
  for (let j = low; j < high; j++) {
    updateBar(bars[j], array[j], true);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      updateBar(bars[i], array[i]);
      updateBar(bars[j], array[j]);
    }
    await sleep(delay);
    updateBar(bars[j], array[j], false);
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  updateBar(bars[i + 1], array[i + 1]);
  updateBar(bars[high], array[high]);
  return i + 1;
}

async function heapSort() {
  updateExplanation("Heap Sort: Build a max heap, then extract elements from the top one by one.");
  const n = array.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    updateBars();
    await sleep(delay);
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    updateBars();
    await sleep(delay);
    await heapify(n, largest);
  }
}

function updateBars() {
  const bars = document.querySelectorAll(".bar");
  array.forEach((val, i) => bars[i].style.height = `${val}px`);
}
