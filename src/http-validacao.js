import chalk from "chalk";

var cache = {};

function extraiLinks (arrLinks) {
  return arrLinks.map((objetoLink) => Object.values(objetoLink).join())
}

async function checaStatus (listaURLs) {

  const arrStatus = await Promise
  .all(
    listaURLs.map(async (url) => {
      if (cache[url])
      {
        return cache[url]; // retorna a url do cache
      } 
      try {
        const response = await fetch(url);
        cache[url] = response.status;
        return response.status;
      } catch (erro) {
        cache[url] = manejaErros(erro);
        return manejaErros(erro);
      }
    })
  )
  return arrStatus;
}

function manejaErros (erro) {
  if (erro.cause.code === 'ENOTFOUND') {
    return 'link não encontrado';
  }
  else if (erro.cause.code === 'ECONNREFUSED'){
    return 'falha ao comunicar com o servidor';
  }
  else if (erro.cause.code === 'ETIMEDOUT'){ 
    return 'timeout - servidor demorou para responder';
  } else {
    return 'ocorreu algum erro';
  }
}

export default async function listaValidada (listaDeLinks) {
  const links = extraiLinks(listaDeLinks);
  const status = await checaStatus(links);

  return listaDeLinks.map((objeto, indice) => ({
    ...objeto,
    status: status[indice]
  }))
}
