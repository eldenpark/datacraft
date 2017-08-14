const removeExtension = (fileName) => {
  return fileName.replace(/\.[^/.]+$/, "");
}

exports.default = removeExtension;