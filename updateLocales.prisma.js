const axios = require('axios');
const extra = require('fs-extra');

const pt_BR_API = 'https://api.homolog.ffweb.prismafive.com.br/IntranetRest/api/traducoes/getJSON';

const filePath_pt_BR = './public/locales/pt-BR.json';

async function updateLocales() {
  try {
    const response = await axios.get(pt_BR_API);
    const jsonData = response.data;
    const jsonString = JSON.stringify(jsonData, null, 2);
    await extra.writeFile(filePath_pt_BR, jsonString);
    console.log(`pt_BR atualizado com sucesso!`);
  } catch (error) {
    console.error('Erro ao atualizar o pt_BR:', error);
  }
}

updateLocales();
