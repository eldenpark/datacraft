const SEP = '%NWL%';

const writeWithPrevLines = (ws, prevLines, line, i) => {
  let str = prevLines.join(SEP);
  str += `${SEP}${line}${SEP}${i}\n`;
  ws.write(str);
};

module.exports = {
  writeWithPrevLines
}