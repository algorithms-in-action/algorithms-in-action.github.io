const openInstructions = () => {
  const instruction = document.getElementById('coverShowInstructions');
  if (instruction !== null) {
    instruction.style.display = 'block';
  }
};

export const closeInstructions = () => {
  const instruction = document.getElementById('coverShowInstructions');
  if (instruction !== null) {
    instruction.style.display = 'none';
  }
};

export default openInstructions;
