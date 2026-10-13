const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0';
const QUICK_MODEL = 'Xenova/mobilevit-xx-small';
const MINIMUM_SCORE = 0.08;

let transformersPromise;
let classifierPromise;

const getClassifier = () => {
  if (!classifierPromise) {
    classifierPromise = (async () => {
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
      return pipeline('image-classification', QUICK_MODEL);
    })().catch((error) => {
      classifierPromise = null;
      throw error;
    });
  }
  return classifierPromise;
};

const normalize = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const MODEL_LABEL_WASTE_IDS = new Map([
  ['banana', 'kulit-buah-sayur'],
  ['banana peel', 'kulit-buah-sayur'],
  ['bunch of bananas', 'kulit-buah-sayur'],
  ['orange', 'kulit-buah-sayur'],
  ['lemon', 'kulit-buah-sayur'],
  ['lime', 'kulit-buah-sayur'],
  ['granny smith', 'kulit-buah-sayur'],
  ['cucumber', 'kulit-buah-sayur'],
  ['zucchini', 'kulit-buah-sayur'],
  ['acorn squash', 'kulit-buah-sayur'],
  ['butternut squash', 'kulit-buah-sayur'],
  ['spaghetti squash', 'kulit-buah-sayur'],
  ['artichoke', 'kulit-buah-sayur'],
  ['bell pepper', 'kulit-buah-sayur'],
  ['broccoli', 'kulit-buah-sayur'],
  ['cauliflower', 'kulit-buah-sayur'],
  ['head cabbage', 'kulit-buah-sayur'],
  ['mushroom', 'kulit-buah-sayur'],
  ['paper towel', 'tisu-kotor'],
  ['toilet tissue', 'tisu-kotor'],
  ['tissue paper', 'tisu-kotor'],
  ['plastic bag', 'kemasan-plastik-bersih'],
  ['polythene bag', 'kemasan-plastik-bersih'],
  ['pop bottle', 'botol-plastik'],
  ['water bottle', 'botol-plastik'],
  ['bottle of water', 'botol-plastik'],
  ['plastic bottle', 'botol-plastik'],
  ['beer bottle', 'botol-kaca'],
  ['wine bottle', 'botol-kaca'],
  ['glass bottle', 'botol-kaca'],
  ['can opener', 'kaleng-logam'],
  ['electric battery', 'baterai'],
  ['battery', 'baterai'],
  ['cellular telephone', 'elektronik'],
  ['mobile phone', 'elektronik'],
  ['remote control', 'elektronik'],
  ['desktop computer', 'elektronik'],
  ['laptop', 'elektronik'],
  ['notebook computer', 'elektronik'],
  ['computer keyboard', 'elektronik'],
  ['computer mouse', 'elektronik'],
  ['mouse', 'elektronik'],
  ['modem', 'elektronik'],
  ['telephone', 'elektronik'],
  ['handheld computer', 'elektronik'],
  ['ipod', 'elektronik'],
  ['cassette player', 'elektronik'],
  ['cd player', 'elektronik'],
]);

const findWasteForLabel = (label) => {
  const labels = [...new Set(String(label || '').split(',').map(normalize).filter(Boolean))];
  for (const normalizedLabel of labels) {
    const exactMatch = MODEL_LABEL_WASTE_IDS.get(normalizedLabel);
    if (exactMatch) return exactMatch;
    for (const [modelLabel, wasteId] of MODEL_LABEL_WASTE_IDS) {
      if (normalizedLabel.startsWith(`${modelLabel} `)) return wasteId;
    }
  }
  return null;
};

export const recognizeWasteInBrowser = async (imageDataUrl, onStage = () => {}) => {
  const imageBlob = await fetch(imageDataUrl).then((response) => {
    if (!response.ok) throw new Error('Foto tidak dapat disiapkan untuk pengenalan.');
    return response.blob();
  });

  onStage('Menyiapkan model pengenalan di perangkat (unduhan pertama sekitar 22 MB)...');
  const classifier = await getClassifier();
  onStage('Mengenali benda dengan model visual di perangkat...');
  const predictions = await classifier(imageBlob, { top_k: 10 });
  const match = (predictions || []).find((prediction) => (
    Number(prediction.score) >= MINIMUM_SCORE && findWasteForLabel(prediction.label)
  ));

  if (!match) return null;
  return {
    wasteId: findWasteForLabel(match.label),
    confidence: Number(match.score),
    label: match.label,
  };
};
