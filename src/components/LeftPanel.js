import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
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
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);

  const handleClick1 = () => {
    setOpen(!open);
  };
  const handleClick2 = () => {
    setOpen1(!open1);
  };
  const handleClick3 = () => {
    setOpen2(!open2);
  };

  const isInputUnderline = true;

  return (
    <>
      <Input
        className="search-input"
        placeholder="Search..."
        disableUnderline={isInputUnderline}
      />

      <div className="itemListContainer">
        <List>
          <ListItem button onClick={handleClick1} className="algorithm-list-bg">
            <ListItemText
              primary="Dynamic Programming"
              disableTypography
              className="algorithm-list-main"
            />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button onClick={() => { dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'kmp' }); }}>
                <ListItemText
                  primary="Knuth-Morris-Pratt's String Search"
                  disableTypography
                  className="algorithm-list-sub"
                />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleClick2} className="algorithm-list-bg">
            <ListItemText
              primary="Graphs"
              disableTypography
              className="algorithm-list-main"
            />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button onClick={() => { dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'binaryTreeSearch' }); }}>
                <ListItemText
                  primary="Binary Search Tree"
                  disableTypography
                  className="algorithm-list-sub"
                />
              </ListItem>
              <ListItem button onClick={() => { dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'transitiveClosure' }); }}>
                <ListItemText
                  primary="Transitive closure"
                  disableTypography
                  className="algorithm-list-sub"
                />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleClick3} className="algorithm-list-bg">
            <ListItemText
              primary="Sorting"
              disableTypography
              className="algorithm-list-main"
            />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => { dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'quicksort' }); }}
              >
                <ListItemText
                  primary="Quick Sort"
                  disableTypography
                  className="algorithm-list-sub"
                />
              </ListItem>
              <ListItem button onClick={() => { dispatch(GlobalActions.LOAD_ALGORITHM, { name: 'heapsort' }); }}>
                <ListItemText
                  primary="Heap Sort"
                  disableTypography
                  className="algorithm-list-sub"
                />
              </ListItem>
            </List>
          </Collapse>
        </List>
        <Divider />
      </div>
    </>
  );
}

export default LeftPanel;
