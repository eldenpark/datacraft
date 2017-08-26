const _removeExtension = (fileName) => {
  return fileName.replace(/\.[^/.]+$/, "");
}

const extractFileName = (path) => {
  const filename = path.replace(/^.*[\\\/]/, '');
  return _removeExtension(filename);
}

module.exports = {
  extractFileName
}