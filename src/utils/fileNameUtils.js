const _removeExtension = (fileName) => {
  return fileName.replace(/\.[^/.]+$/, "");
}

const extractFileName = (path) => {
  const str = path.split('/');
  const token = str[str.length - 1];
  return _removeExtension(token);
}

module.exports = {
  extractFileName
}