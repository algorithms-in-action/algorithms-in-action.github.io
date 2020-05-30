/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
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
  const [displaySearch, setDisplaySearch] = React.useState(null);

  // Realize the function of dropdown list.
  const handleClick = (itemId) => {
    if (itemId === 1) {
      setOpenDynamic(!openDynamic);
    } else if (itemId === 2) {
      setOpenGraph(!openGraph);
    } else if (itemId === 3) {
      setOpenSorting(!openSorting);
    }
  };

  // The Search List.
  const algorithmListName = [
    { name: 'Knuth-Morris-Pratt \'s String Search', onClickEvent: 'kmp' },
    { name: 'Binary Search Tree', onClickEvent: 'binaryTreeSearch' },
    { name: 'Transitive closure', onClickEvent: 'transitiveClosure' },
    { name: 'Quick Sort', onClickEvent: 'quicksort' },
    { name: 'Heap Sort', onClickEvent: 'heapsort' },
  ];

  // The Main list in the left panel.
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

  // Search Function Component
  const searchAlgorithm = (e) => {
    const inputContent = e.target.value.trim().toLowerCase();
    let algorithmListChosen = null;
    if (inputContent.length > 0) {
      algorithmListChosen = algorithmListName.filter((i) => {
        return i.name.toLowerCase().match(inputContent);
      });
    }
    setDisplaySearch(algorithmListChosen);
  };

  return (
    <>
      <Input
        className="search-input"
        placeholder="Search..."
        data-testid="search-input"
        onChange={searchAlgorithm}
      />
      <div className="itemListContainer">

        {
          (displaySearch === null)
            ? (
              <List>
                {
                algorithmList.map((el) => {
                  return (
                    <div key={el.id}>
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
                         el.subAlgorithm.map((item) => {
                           return (
                             <List component="div" disablePadding key={item.name}>
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
            )
            : (
              <div>
                {displaySearch.map((item) => {
                  return (
                    <List component="div" disablePadding key={item}>
                      <ListItem
                        button
                        onClick={() => {
                          dispatch(GlobalActions.LOAD_ALGORITHM, { name: item.onClickEvent });
                        }}
                      >
                        <ListItemText
                          primary={item.name}
                          disableTypography
                          className="algorithm-list-sub"
                        />
                      </ListItem>
                    </List>
                  );
                })}
              </div>
            )
        }

      </div>

    </>
  );
}

export default LeftPanel;
