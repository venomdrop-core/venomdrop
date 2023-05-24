import Identicon from "identicon.js";

const getHexCode = (hash = ''): string => {
  let result = '';
  for (let i=0; i<hash.length; i++) {
    result += hash.charCodeAt(i).toString(16);
  }
  return result;
}

export const getIdenticonSrc = (hash?: string) => {
  if (!hash || hash.length < 15) {
    return
  }
  const data = new Identicon((getHexCode(hash)), 420).toString();
  return `data:image/png;base64,${data}`
}
