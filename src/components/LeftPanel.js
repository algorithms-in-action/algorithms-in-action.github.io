/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
import React, { useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Input } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { GlobalContext } from '../context/GlobalState';
import { GlobalActions } from '../context/actions';
import '../styles/LeftPanel.scss';
import { AlgorithmCategoryList, AlgorithmList } from '../algorithms';


function LeftPanel() {
  const { dispatch } = useContext(GlobalContext);
  // const [openDynamic, setOpenDynamic] = useState(false);
  // const [openGraph, setOpenGraph] = useState(true);
  const [openSorting, setOpenSorting] = useState(true);
  const [displaySearch, setDisplaySearch] = useState(null);


  // create a state for all list item
  const itemList = [];
  AlgorithmCategoryList.forEach((cat) => itemList.push(
    {
      name: cat.category,
      id: cat.num,
      status: true,
    },
  ));

  const [itemListState, setItemListState] = useState(AlgorithmCategoryList);

  const handleClick = (itemId) => {
    setOpenSorting(!openSorting);

    console.log('BEFORE', itemListState);
    const itemIndex = itemListState.findIndex((x) => x.num === itemId);
    itemListState[itemIndex].status = !itemListState[itemIndex].status;
    setItemListState(itemListState);
    console.log('AFTER', itemListState);
  };

  // const algorithmSearchList = [
  //   { name: 'Knuth-Morris-Pratt \'s String Search', onClickEvent: 'kmp' },
  //   { name: 'Binary Search Tree', onClickEvent: 'binarySearchTree' },
  //   { name: 'Transitive closure', onClickEvent: 'transitiveClosure' },
  //   { name: 'Quick Sort', onClickEvent: 'quickSort' },
  //   { name: 'Heap Sort', onClickEvent: 'heapSort' },
  // ];

  // Search Function Component
  const searchAlgorithm = (e) => {
    const inputContent = e.target.value.trim().toLowerCase();
    let algorithmListChosen = null;
    if (inputContent.length > 0) {
      algorithmListChosen = AlgorithmList.filter((i) => {
        return i.name.toLowerCase().match(inputContent);
      });
    }
    setDisplaySearch(algorithmListChosen);
  };

  // if the search input field is empty, Display the main list.
  // if the search input field has the value, Display the search list.

  const isDisableUnderline = true;

  return (
    <>
      <Input
        className="search-input"
        placeholder="Search..."
        data-testid="search-input"
        disableUnderline={isDisableUnderline}
        onChange={searchAlgorithm}
      />
      <div className="itemListContainer">

        {
          (displaySearch === null)
            ? (
              <List>
                {
                itemListState.map((el) => {
                  return (
                    <div key={el.num}>
                      <ListItem button onClick={() => handleClick(el.num)} className="algorithm-list-bg">
                        <ListItemText
                          primary={el.category}
                          disableTypography
                          className="algorithm-list-main"
                        />
                        {console.log('HELLO', itemListState)}
                        {itemListState.find((x) => x.num === el.num).status ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={openSorting} timeout="auto" unmountOnExit>
                        {
                         el.list.map((item) => {
                           return (
                             <List component="div" disablePadding key={item.name}>
                               <ListItem
                                 button
                                 onClick={() => {
                                   dispatch(GlobalActions.LOAD_ALGORITHM, { name: item.id });
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
                          dispatch(GlobalActions.LOAD_ALGORITHM, { name: item.id });
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
