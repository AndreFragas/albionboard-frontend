const fs = require('fs');
const path = require('path');

const filePath = 'public/locales/pt-BR.json';

function getAllFinalKeys(obj, parentKey = '') {
  const finalKeys = [];

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const newParentKey = parentKey ? `${parentKey}.${key}` : key;
      finalKeys.push(...getAllFinalKeys(obj[key], newParentKey));
    } else {
      const finalKey = parentKey ? `${parentKey}.${key}` : key;
      finalKeys.push(finalKey);
    }
  }

  return finalKeys;
}

function findKeysInFiles(keys, directory) {
  const finalKeys = keys.map((key) => key.replace(/\./g, '\\.'));
  const regex = new RegExp(`\\b(${finalKeys.join('|')})\\b`, 'g');
  const foundKeys = new Set();

  function processFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const matches = fileContent.match(regex);
      if (matches) {
        matches.forEach((match) => foundKeys.add(match));
      }
    } catch (error) {
      console.error(`Erro ao processar o arquivo ${filePath}: ${error}`);
    }
  }

  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else {
        processFile(filePath);
      }
    }
  }

  processDirectory(directory);

  return foundKeys;
}

const whiteList = ['navbar', 'errors.api.', 'parametro.'];

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Erro ao ler o arquivo JSON: ${err}`);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const finalKeys = getAllFinalKeys(jsonData);
    const foundKeys = findKeysInFiles(finalKeys, './src');
    finalKeys.forEach((key) => {
      if (whiteList.some((value) => key.includes(value))) return;
      if (!foundKeys.has(key)) {
        console.log(`Chave não encontrada no projeto: ${key}`);
      }
    });
  } catch (parseError) {
    console.error(`Erro ao analisar o JSON: ${parseError}`);
  }
});
