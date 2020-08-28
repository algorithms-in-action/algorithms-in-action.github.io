/* eslint-disable max-len */
import React, { useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Input } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/LeftPanel.scss';
import { AlgorithmCategoryList, AlgorithmList } from '../../algorithms';

function LeftPanel() {
  const itemListState = AlgorithmCategoryList;
  const { dispatch } = useContext(GlobalContext);
  const [displaySearch, setDisplaySearch] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [openStatus, setOpenStatus] = useState(AlgorithmCategoryList.map((obj) => true));

  // Handle items when clicked
  const handleClick = (itemId) => {
    const itemIndex = itemListState.findIndex((cat) => cat.id === itemId);
    setOpenStatus(
      openStatus.map((item, index) => (
        (index === itemIndex) ? !item : item
      )),
    );
  };

  // Search Function Component
  const searchAlgorithm = (e) => {
    const inputContent = e.target.value.trim().toLowerCase();
    let algorithmListChosen = null;
    if (inputContent.length > 0) {
      algorithmListChosen = AlgorithmList.filter((i) => i.name.toLowerCase().match(inputContent));
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
                itemListState.map((cat) => (
                  <div key={cat.id}>
                    <ListItem button onClick={() => handleClick(cat.id)} className="algorithm-list-bg">
                      <ListItemText
                        primary={cat.category}
                        disableTypography
                        className="algorithm-list-main"
                      />
                      {openStatus[cat.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openStatus[cat.id]} timeout="auto" unmountOnExit>
                      {
                         cat.algorithms.map((algo) => (
                           <List component="div" disablePadding key={algo.name}>
                             <ListItem
                               button
                               onClick={() => {
                                 dispatch(GlobalActions.LOAD_ALGORITHM, { name: algo.shorthand });
                               }}
                             >
                               <ListItemText
                                 primary={algo.name}
                                 disableTypography
                                 className="algorithm-list-sub"
                               />
                             </ListItem>
                           </List>
                         ))
                      }
                    </Collapse>
                  </div>
                ))
                }
              </List>
            )
            : (
              <div>
                {displaySearch.map((algo) => (
                  <List component="div" disablePadding key={algo}>
                    <ListItem
                      button
                      onClick={() => {
                        dispatch(GlobalActions.LOAD_ALGORITHM, { name: algo.shorthand });
                      }}
                    >
                      <ListItemText
                        primary={algo.name}
                        disableTypography
                        className="algorithm-list-sub"
                      />
                    </ListItem>
                  </List>
                ))}
              </div>
            )
        }

      </div>

    </>
  );
}

export default LeftPanel;
