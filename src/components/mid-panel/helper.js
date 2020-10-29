const openInstructions = () => {
  const instruction = document.getElementById('coverShowInstructions');
  instruction.style.display = 'block';
};

export const closeInstructions = () => {
  const instruction = document.getElementById('coverShowInstructions');
  instruction.style.display = 'none';
};

export default openInstructions;
