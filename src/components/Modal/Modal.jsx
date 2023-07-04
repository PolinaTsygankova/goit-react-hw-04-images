import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Backdrop, StyledModal } from './Modal.styled';

export function Modal({ largeImage, toggleModal }) {
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function onKeyDown(e) {
    if (e.code === 'Escape' || e.target === e.currentTarget) {
      toggleModal();
    }
  }

  return (
    <Backdrop className="overlay" onClick={onKeyDown}>
      <StyledModal className="modal">
        <img src={largeImage} alt="LargeImage" />
      </StyledModal>
    </Backdrop>
  );
}

Modal.propTypes = {
  largeImage: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
