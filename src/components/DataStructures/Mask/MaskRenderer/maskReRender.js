
// import BinaryRenderer, {unboxedDigits} from '../BinaryRenderer';

// XXX simplified version of unboxedDigits that returns a string rather
// than an object XXX
// Must be a better way...
const unboxedDigits = (data, maxBits, highlight, base) => {
  let binaryString = data.toString(base);
  if (base === 2 && binaryString.length < maxBits) {
    binaryString = binaryString.padStart(maxBits, '0');
  }
  // return binaryString;
  let spans = binaryString.split('').map((bit, index) => {
    // If index is on highlight, return a highlighted span, else just
    // return a normal span. Need to adjust the index as the string
    // starts at 0, but the 0th position is the last bit
    const adjustedIndex = binaryString.length - index - 1;
    return (
      "<span key=" + index + " className=" +
      (highlight.includes(adjustedIndex) ? "styles.highlighted" : '""') +
      "> " + bit + "</span>"
// <span key={index} className={highlight.includes(adjustedIndex) ? styles.highlighted : ""}> {bit} </span>
    );
  });
  return spans.join('');
}

  // Re-display key in decimal, base 4 (optional) and binary plus
  // mask in binary; some (non-decimal) digits highlighted
  // Called on mouse Click, not via normal re-rendering
  // (XXX must be a better way to hook into things...?)
const reRenderMask = (data) => {
    const { binaryData, maskData, maxBits, highlight, addBase4 } = data;
    let el = document.getElementById('MaskDecimal');
    if (el !== null) {
      el.innerHTML = unboxedDigits(binaryData, maxBits, [],
10);
    }
    el = document.getElementById('MaskBinary');
    if (el !== null) {
      console.log(el.innerHTML);
      el.innerHTML = unboxedDigits(binaryData, maxBits, highlight, 2);
      console.log(el.innerHTML);
    }
    if (!addBase4)
      return;
    el = document.getElementById('MaskBase4');
    if (el !== null) {
      el.innerHTML = unboxedDigits(binaryData, maxBits, [], 4);
    }
    return;
  }

export default reRenderMask;
