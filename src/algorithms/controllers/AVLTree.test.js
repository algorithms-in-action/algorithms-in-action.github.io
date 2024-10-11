/**
 * The purpose of the test here is to detect whether the correct result is generated
 * under the legal input, help developers identify potential errors that may arise 
 * from the rotation logic. 
 *
 * @author StaticSound Team
 *        - Hao Chen        (1314613) <hc4@student.unimelb.edu.au>
 *        - Jiayi Sun       (1305340) <jisun5@student.unimelb.edu.au>
 *        - Junhao Zhu      (1261757) <junhaoz3@student.unimelb.edu.au>
 *        - Ziyu Wang       (1243302) <ziyu6@student.unimelb.edu.au>
 *        - Gaoyongle Zhang (1346309) <gaoyonglez@student.edu.au>
 * 
 * @since  10/10/2024
 */

import AVLTreeInsertion from './AVLTreeInsertion';

// Simple stub for the chunker
const chunker = {
  add: () => { },
};

describe('AVLTreeInsertion', () => {
  // Simple rotation: only envolves one rotate. 
  // The detailed test cases are as follows:
  it('[Simple] No rotation', () => {
    const E = [10, 5, 15];
    const result = {
      key: 10,
      height: 2,
      left: {
        key: 5,
        height: 1,
        left: null,
        right: null
      },
      right: {
        key: 15,
        height: 1,
        left: null,
        right: null
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single left rotate', () => {
    const E = [1, 2, 3];
    const result = {
      key: 2,
      height: 2,
      left: {
        key: 1,
        height: 1,
        left: null,
        right: null
      },
      right: {
        key: 3,
        height: 1,
        left: null,
        right: null
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single right rotate', () => {
    const E = [3, 2, 1];
    const result = {
      key: 2,
      height: 2,
      left: {
        key: 1,
        height: 1,
        left: null,
        right: null
      },
      right: {
        key: 3,
        height: 1,
        left: null,
        right: null
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single LR rotate', () => {
    const E = [3, 1, 2];
    const result = {
      key: 2,
      height: 2,
      left: {
        key: 1,
        height: 1,
        left: null,
        right: null
      },
      right: {
        key: 3,
        height: 1,
        left: null,
        right: null
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Simple] Single RL rotate', () => {
    const E = [1, 3, 2];
    const result = {
      key: 2,
      height: 2,
      left: {
        key: 1,
        height: 1,
        left: null,
        right: null
      },
      right: {
        key: 3,
        height: 1,
        left: null,
        right: null
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });

  // Complex rotation: envolves multiple rotates. 
  // The detailed test cases are as follows:
  it('[Complex] Complex rotates 1', () => {
    const E = [4, 5, 7, 9, 8];
    const result = {
      key: 5,
      height: 3,
      left: {
        key: 4,
        height: 1,
        left: null,
        right: null
      },
      right: {
        key: 8,
        height: 2,
        left: {
          key: 7,
          height: 1,
          left: null,
          right: null
        },
        right: {
          key: 9,
          height: 1,
          left: null,
          right: null
        }
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Complex] Complex rotates 2', () => {
    const E = [40, 20, 60, 10, 30, 50, 70, 25, 5, 35, 15, 55, 65];
    const result = {
      key: 40,
      height: 4,
      left: {
        key: 20,
        height: 3,
        left: {
          key: 10,
          height: 2,
          left: {
            key: 5,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 15,
            height: 1,
            left: null,
            right: null
          }
        },
        right: {
          key: 30,
          height: 2,
          left: {
            key: 25,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 35,
            height: 1,
            left: null,
            right: null
          }
        }
      },
      right: {
        key: 60,
        height: 3,
        left: {
          key: 50,
          height: 2,
          left: null,
          right: {
            key: 55,
            height: 1,
            left: null,
            right: null
          }
        },
        right: {
          key: 70,
          height: 2,
          left: {
            key: 65,
            height: 1,
            left: null,
            right: null
          },
          right: null
        }
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Complex] Complex rotates 3', () => {
    const E = [50, 30, 70, 20, 40, 60, 80, 35, 10, 45, 25, 65, 75, 58];
    const result = {
      key: 50,
      height: 4,
      left: {
        key: 30,
        height: 3,
        left: {
          key: 20,
          height: 2,
          left: {
            key: 10,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 25,
            height: 1,
            left: null,
            right: null
          }
        },
        right: {
          key: 40,
          height: 2,
          left: {
            key: 35,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 45,
            height: 1,
            left: null,
            right: null
          }
        }
      },
      right: {
        key: 70,
        height: 3,
        left: {
          key: 60,
          height: 2,
          left: {
            key: 58,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 65,
            height: 1,
            left: null,
            right: null
          }
        },
        right: {
          key: 80,
          height: 2,
          left: {
            key: 75,
            height: 1,
            left: null,
            right: null
          },
          right: null
        }
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
  it('[Complex] Complex rotates 4', () => {
    const E = [135, 54, 121, 29, 71, 12, 199, 64, 102, 36, 85, 144, 168, 211, 175, 307, 2, 73, 56, 27];
    const result = {
      key: 71,
      height: 5,
      left: {
        key: 29,
        height: 4,
        left: {
          key: 12,
          height: 2,
          left: {
            key: 2,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 27,
            height: 1,
            left: null,
            right: null
          }
        },
        right: {
          key: 54,
          height: 3,
          left: {
            key: 36,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 64,
            height: 2,
            left: {
              key: 56,
              height: 1,
              left: null,
              right: null
            },
            right: null
          }
        }
      },
      right: {
        key: 168,
        height: 4,
        left: {
          key: 121,
          height: 3,
          left: {
            key: 85,
            height: 2,
            left: {
              key: 73,
              height: 1,
              left: null,
              right: null
            },
            right: {
              key: 102,
              height: 1,
              left: null,
              right: null
            }
          },
          right: {
            key: 144,
            height: 2,
            left: {
              key: 135,
              height: 1,
              left: null,
              right: null
            },
            right: null
          }
        },
        right: {
          key: 199,
          height: 3,
          left: {
            key: 175,
            height: 1,
            left: null,
            right: null
          },
          right: {
            key: 211,
            height: 2,
            left: null,
            right: {
              key: 307,
              height: 1,
              left: null,
              right: null
            }
          }
        }
      }
    };
    expect(AVLTreeInsertion.run(chunker, { nodes: E })).toEqual(result);
  });
});
