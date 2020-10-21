/* eslint-disable max-len */
import React, { useContext, useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Input, withStyles } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/LeftPanel.scss';
import { AlgorithmCategoryList, AlgorithmList } from '../../algorithms';
import { increaseFontSize, setFontSize } from '../top/helper';

function LeftPanel({ fontSize, fontSizeIncrement }) {
  const itemListState = AlgorithmCategoryList;
  const { dispatch } = useContext(GlobalContext);
  const [displaySearch, setDisplaySearch] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [openStatus, setOpenStatus] = useState(AlgorithmCategoryList.map((obj) => true));

  const { algorithm } = useContext(GlobalContext);

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

  const StyledListItem = withStyles({
    root: {
      backgroundColor: 'white',
      '&.Mui-selected': {
        backgroundColor: '#EAEAEA',
      },
    },
  })(ListItem);


  const fontID = 'itemListContainer';
  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [algorithm.explanation, fontSize, fontSizeIncrement]);

  const openCover = () => {
    document.getElementById('coverShowInstructions').style.display = 'block';
  };


  return (
    <div className="container">
      <Input
        className="search-input"
        placeholder="Search..."
        data-testid="search-input"
        disableUnderline={isDisableUnderline}
        onChange={searchAlgorithm}
      />
      <div className="itemListContainer" id={fontID}>

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
                    </ListItem>
                    <Collapse in={openStatus[cat.id]} timeout="auto" unmountOnExit>
                      {
                         cat.algorithms.map((algo) => (
                           <List component="div" disablePadding key={algo.name}>
                             <StyledListItem
                               selected={algorithm.name === algo.name}
                               button
                               onClick={() => {
                                 openCover();
                                 dispatch(GlobalActions.LOAD_ALGORITHM, { name: algo.shorthand, mode: algo.mode });
                               }}
                             >
                               <ListItemText
                                 primary={algo.name}
                                 disableTypography
                                 className="algorithm-list-sub"
                               />
                             </StyledListItem>
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
                  <List component="div" disablePadding key={algo.id}>
                    <StyledListItem
                      selected={algorithm.name === algo.name}
                      button
                      onClick={() => {
                        dispatch(GlobalActions.LOAD_ALGORITHM, { name: algo.shorthand, mode: algo.mode });
                      }}
                    >
                      <ListItemText
                        primary={algo.name}
                        disableTypography
                        className="algorithm-list-sub"
                      />
                    </StyledListItem>
                  </List>
                ))}
              </div>
            )
        }

      </div>
    </div>
  );
}

export default LeftPanel;
LeftPanel.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
