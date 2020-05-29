import React, { useContext } from 'react';
import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Input } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { GlobalContext } from '../context/GlobalState';
import { GlobalActions } from '../context/actions';
import '../styles/LeftPanel.scss';


function LeftPanel() {
  const { dispatch } = useContext(GlobalContext);
  const [openDynamic, setOpenDynamic] = React.useState(false);
  const [openGraph, setOpenGraph] = React.useState(true);
  const [openSorting, setOpenSorting] = React.useState(true);


  const handleClick = (el) => {
    if (el === 1) {
      setOpenDynamic(!openDynamic);
    } else if (el === 2) {
      setOpenGraph(!openGraph);
    } else if (el === 3) {
      setOpenSorting(!openSorting);
    }
  };
  const isInputUnderline = true;

  // Search Input Component
  const searchAlgorithm = (e) => {
    // eslint-disable-next-line no-console
    // console.log(e.target.value);
    if (e.target.value === 'Knuth-Morris-Pratt \'s String Search') {
      console.log('xxx');
    }
  };

  const algorithmList = [{
    id: 1,
    name: 'Dynamic Programming',
    className: 'algorithm-list-main',
    openStatus: openDynamic,
    subAlgorithm: [{
      name: 'Knuth-Morris-Pratt \'s String Search',
      className: 'algorithm-list-sub',
      onClickEvent: 'kmp',
    }],
  }, {
    id: 2,
    name: 'Graphs',
    className: 'algorithm-list-main',
    openStatus: openGraph,
    subAlgorithm: [{
      name: 'Binary Search Tree',
      className: 'algorithm-list-sub',
      onClickEvent: 'binaryTreeSearch',
    }, {
      name: 'Transitive closure',
      className: 'algorithm-list-sub',
      onClickEvent: 'transitiveClosure',

    }],
  },
  {
    id: 3,
    name: 'Sorting',
    className: 'algorithm-list-main',
    openStatus: openSorting,
    subAlgorithm: [{
      name: 'Quick Sort',
      className: 'algorithm-list-sub',
      onClickEvent: 'quicksort',
    }, {
      name: 'Heap Sort',
      className: 'algorithm-list-sub',
      onClickEvent: 'heapsort',

    }],
  },
  ];

  return (
    <>
      <Input
        className="search-input"
        placeholder="Search..."
        disableUnderline={isInputUnderline}
        onChange={searchAlgorithm}
      />
      <div className="itemListContainer">
        <List>
          {
            // eslint-disable-next-line arrow-body-style
            algorithmList.map((el) => {
              return (
                <div>
                  <ListItem button onClick={() => handleClick(el.id)} className="algorithm-list-bg">
                    <ListItemText
                      primary={el.name}
                      disableTypography
                      className={el.className}
                    />
                    {el.openStatus ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={el.openStatus} timeout="auto" unmountOnExit>
                    {
                     // eslint-disable-next-line arrow-body-style
                     el.subAlgorithm.map((item) => {
                       return (
                         <List component="div" disablePadding>
                           <ListItem
                             button
                             onClick={() => {
                               dispatch(GlobalActions.LOAD_ALGORITHM, { name: item.onClickEvent });
                             }}
                           >
                             <ListItemText
                               primary={item.name}
                               disableTypography
                               className={item.className}
                             />
                           </ListItem>
                         </List>
                       );
                     })
                  }
                  </Collapse>
                </div>
              );
            })
          }
        </List>

      </div>

    </>
  );
}

export default LeftPanel;
