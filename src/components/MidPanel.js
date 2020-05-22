/* eslint-disable no-unused-vars */
import React from 'react';
import '../styles/MidPanel.scss';
import GraphTracer from './Graph/GraphTracer';

class MidPanel extends React.Component {
  constructor(props) {
    super(props);
    this.a = new GraphTracer("key", this.root, "Test graph");
    this.a.set([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]]);
    this.reset();
  }

  reset() {
    this.root = null;
    this.objects = {};
  }

  test() {
    // this.root = new GraphTracer("key", this.root, "asdsa");
  }

  render() {
    console.log(this.a);
    this.a.layoutTree(5);
    // this.a.visit[]
    // this.a.visit([5, null]);
    // const { className } = this.props;
    // let a = new GraphTracer("key", this.root, "Test graph");

    // a.visit([3, 5]);
    return (
      <div className="midPanelContainer">
        dasdsa
        <button type="button" value="test" onClick={this.test}>
          Explanation
        </button>
        <div className="graph">
          {
          this.a && this.a.render()
        }
        </div>
      </div>
    );
  }
}


export default MidPanel;
