const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0';
const DETECTOR_MODEL = 'Xenova/yolos-tiny';
const MINIMUM_SCORE = 0.35;

let transformersPromise;
let detectorPromise;

const getDetector = () => {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      if (!transformersPromise) {
        transformersPromise = import(/* @vite-ignore */ TRANSFORMERS_URL)
          .then((transformers) => {
            transformers.env.allowLocalModels = false;
            return transformers;
          })
          .catch((error) => {
            transformersPromise = null;
            throw error;
          });
      }
      const { pipeline } = await transformersPromise;
      return pipeline('object-detection', DETECTOR_MODEL, { dtype: 'q4' });
    })().catch((error) => {
      detectorPromise = null;
      throw error;
    });
  }
  return detectorPromise;
};

const DETECTED_WASTE_IDS = new Map([
  ['bottle', 'botol-minuman'],
  ['banana', 'kulit-buah-sayur'],
  ['apple', 'kulit-buah-sayur'],
  ['orange', 'kulit-buah-sayur'],
  ['broccoli', 'kulit-buah-sayur'],
  ['carrot', 'kulit-buah-sayur'],
  ['sandwich', 'sisa-makanan'],
  ['pizza', 'sisa-makanan'],
  ['donut', 'sisa-makanan'],
  ['cake', 'sisa-makanan'],
  ['hot dog', 'sisa-makanan'],
  ['mouse', 'elektronik'],
  ['remote', 'elektronik'],
  ['keyboard', 'elektronik'],
  ['cell phone', 'elektronik'],
  ['laptop', 'elektronik'],
  ['tv', 'elektronik'],
  ['microwave', 'elektronik'],
  ['oven', 'elektronik'],
  ['toaster', 'elektronik'],
  ['hair drier', 'elektronik'],
  ['book', 'kertas-karton'],
]);

export const recognizeWasteInBrowser = async (imageDataUrl, onStage = () => {}) => {
  const imageBlob = await fetch(imageDataUrl).then((response) => {
    if (!response.ok) throw new Error('Foto tidak dapat disiapkan untuk pengenalan.');
    return response.blob();
  });

  onStage('Menyiapkan model deteksi benda di perangkat (unduhan pertama sekitar 10 MB)...');
  const detector = await getDetector();
  onStage('Mencari benda yang terlihat pada foto...');
  const detections = await detector(imageBlob, { threshold: MINIMUM_SCORE });

  const match = (detections || [])
    .filter((detection) => DETECTED_WASTE_IDS.has(String(detection.label || '').toLowerCase()))
    .sort((first, second) => Number(second.score) - Number(first.score))[0];

  if (!match) return null;
  return {
    wasteId: DETECTED_WASTE_IDS.get(String(match.label).toLowerCase()),
    confidence: Number(match.score),
    label: match.label,
  };
};
