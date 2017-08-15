const getDistancesBetweenSameElems = (arr) => {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (_not(arr[i]) && arr[i] == arr[j]) {
        res.push(j - i);
      }
    }
  }
  return res;
}

const _not = (word) => {
  return !word.match(/[^0-9a-zA-Z]/g)
  // var exclusions = [' ', '', '\"', '\'', '\t', '(', ')', '\s', ',', '.', ';'];
  // return !exclusions.includes(word);
}

const hasCommonElem = (arr1, arr2) => {
  for (let i = 0; i < arr2.length; i++) {
    if (arr1.includes(arr2[i])) return true;
  }
  return false;
}

module.exports = {
  getDistancesBetweenSameElems,
  hasCommonElem
}