import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

async function imprimeLista(valida, json, resultado, identificador = '') {
    console.clear();
  if (valida && !json) {
    console.log(
      chalk.yellow('lista validada (valida e !json) '),
      chalk.black.bgGreen(identificador),
      await listaValidada(resultado.links),
      //imprimeColorido(await listaValidada(resultado.links)),
      chalk.yellow("total de links: " + resultado.total_links)   
    );
  } else if (valida && json) {
    console.log(
      chalk.yellow('lista validada (valida e json) '),
      chalk.black.bgGreen(identificador),
      JSON.stringify(await listaValidada(resultado.links), null, 2),
      chalk.yellow("total de links: " + resultado.total_links)
    )
  }
  else {
    console.log(
      chalk.yellow('lista de links (else)'),
      chalk.black.bgGreen(identificador.links),
      resultado);
  }
      
}

function imprimeColorido(objetos){
      const objetosFormatados = objetos.map(objeto => {
          const novoObjeto = {};
          for (const chave in objeto) {
            const valor = objeto[chave];
            if (typeof valor === 'number') {
              novoObjeto[chave] = chalk.yellow(valor);
            } else {
              novoObjeto[chave] = chalk.red(valor);
            }
          }
          return novoObjeto;
        });
    return objetosFormatados;
}



async function processaTexto(argumentos) {
  const caminho = argumentos[2];
  const valida = argumentos[3] === '--valida';
  const json = argumentos[4] === '--json';

  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log('arquivo ou diretório não existe');
      return;
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    const resultado = await pegaArquivo(argumentos[2]);
    imprimeLista(valida, json, resultado);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    const arquivos = await fs.promises.readdir(caminho)
    arquivos.forEach(async (nomeDeArquivo) => {
      const lista = await pegaArquivo(`${caminho}/${nomeDeArquivo}`)
      imprimeLista(valida, json, lista, nomeDeArquivo)
    })
  }
}

processaTexto(caminho);