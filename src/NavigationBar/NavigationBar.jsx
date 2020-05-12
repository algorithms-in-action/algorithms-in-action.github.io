import React from 'react';
import './NavigationBar.css';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { PseudocodeMode: 'Clicked', ExplanationMode: 'Unclicked' };
    this.clickPseudocode = this.clickPseudocode.bind(this);
    this.clickExplanation = this.clickExplanation.bind(this);
  }

  clickPseudocode() {
    this.setState({ PseudocodeMode: 'Clicked', ExplanationMode: 'Unclicked' });
  }

  clickExplanation() {
    this.setState({ PseudocodeMode: 'Unclicked', ExplanationMode: 'Clicked' });
  }

  render() {
    const { PseudocodeMode, ExplanationMode } = this.state;
    return (
      <div className="NavigationBar">
        <button className={ExplanationMode} type="button" onClick={this.clickExplanation}>
          Explanation
        </button>
        <button className={PseudocodeMode} type="button" onClick={this.clickPseudocode}>
          Pseudocode
        </button>
      </div>
    );
  }
}

export default NavigationBar;
