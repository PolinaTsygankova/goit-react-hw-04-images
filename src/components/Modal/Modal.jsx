import PropTypes from 'prop-types';
import React, { useEffect, useCallback } from 'react';
import { Backdrop, StyledModal } from './Modal.styled';

export function Modal({ largeImage, toggleModal }) {
  const memoizedKeyDown = useCallback(
    e => {
      if (e.code === 'Escape' || e.target === e.currentTarget) {
        toggleModal();
      }
    },
    [toggleModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', memoizedKeyDown);

    return () => {
      window.removeEventListener('keydown', memoizedKeyDown);
    };
  }, [memoizedKeyDown]);

  return (
    <Backdrop className="overlay" onClick={memoizedKeyDown}>
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
