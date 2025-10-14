import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../../assets/logo.svg';
import AlgorithmMenu from './AlgorithmMenu';

function Header({ onSetting }) {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const buttonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: "var(--top-header-btn)"
  };

  const hoverTapAnim = {
    whileHover: { scale: 1.05, color: 'var(--accent-color, #0077ff)' },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '40px',
          background: 'var(--top-header-bg)',
        }}
      >
        <motion.button
          {...hoverTapAnim}
          style={{...buttonStyle, marginLeft: "8px"}}
          onClick={handleOpen}
        >
          Menu
        </motion.button>

        <motion.button
          {...hoverTapAnim}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            height: '100%',
          }}
          onClick={() => history.push('/mainmenu')}
        >
          <motion.img
            src={logo}
            alt="logo"
            style={{ height: '60%' }}
            whileHover={{ rotate: 5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          />
          <h1 style={{ fontSize: '1.1rem', margin: 0, color: "var(--top-header-btn)" }}>Algorithms in Action</h1>
        </motion.button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            height: '100%',
            marginRight: "8px"
          }}
        >
          <motion.button
            {...hoverTapAnim}
            style={buttonStyle}
            onClick={() => history.push('/mainmenu')}
          >
            Home
          </motion.button>

          <motion.button
            {...hoverTapAnim}
            style={buttonStyle}
            onClick={() => history.push('/about')}
          >
            About
          </motion.button>

          <motion.button
            {...hoverTapAnim}
            style={buttonStyle}
            onClick={onSetting}
          >
            Settings
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {open && (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="algorithm-menu-modal"
            sx={{backdropFilter: 'blur(2px)', backgroundColor: "transparent"}}
          >
            <motion.div
              key="algorithm-menu"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                width: 'fit-content',
                height: '100vh',
                boxShadow: '4px 0 12px rgba(0,0,0,0.2)',
                overflowY: 'auto',
              }}
            >
              <AlgorithmMenu onClose={handleClose} />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

Header.propTypes = {
  onSetting: PropTypes.func.isRequired,
};

export default Header;
