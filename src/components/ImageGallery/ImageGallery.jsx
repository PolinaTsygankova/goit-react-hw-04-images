import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Gallery } from './ImageGallery.styled';
import { ImageGalleryItem } from './../ImageGalleryItem/ImageGalleryItem';
import { Modal } from './../Modal/Modal';

export function ImageGallery({ images }) {
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');

  function toggleModal(e) {
    setShowModal(prevShowModal => !prevShowModal);
  }

  function getLargeImgForModal(largeImage) {
    setLargeImage(largeImage);
  }

  return (
    <>
      {images === [] && toast('Wow so easy!')}
      {images && (
        <Gallery className="gallery">
          {images.map(({ id, webformatURL, largeImageURL, tags }) => (
            <ImageGalleryItem
              key={id}
              smallImg={webformatURL}
              largeImg={largeImageURL}
              tags={tags}
              toggleModal={toggleModal}
              getLargeImgForModal={getLargeImgForModal}
            />
          ))}
        </Gallery>
      )}
      {showModal && <Modal largeImage={largeImage} toggleModal={toggleModal} />}
    </>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
};
