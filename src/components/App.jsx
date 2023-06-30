import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { fetchToGallery } from './api/fetchToGallery';
import { ToastContainer } from 'react-toastify';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader.jsx/Loader';
import { Button } from './Button/Button';
import { AppStyled } from './App.styled';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};

export function App() {
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [isButtonExist, setIsButtonExist] = useState(false);
  const [textQuery, setTextQuery] = useState('');

  useEffect(() => {
    setImages([]);
    setErrorMessage('');
    setCurrentPage(1);
    setStatus(STATUS.IDLE);
    setIsButtonExist(false);
  }, [textQuery]);

  useEffect(() => {
    if (textQuery.trim() === '') {
      return;
    }

    fetchToGallery(textQuery, currentPage)
      .then(res => {
        if (res.total === 0) {
          toast.error(`Sorry, we don't have images with ${textQuery}`);
          setStatus(STATUS.REJECTED);
        } else {
          setImages(prevImages => [...prevImages, ...res.hits]);
          setIsButtonExist(currentPage < Math.ceil(res.total / 12));
          setStatus(STATUS.RESOLVED);
        }
      })
      .catch(error => {
        setErrorMessage(error.message);
        setStatus(STATUS.REJECTED);
      });
  }, [textQuery, currentPage]);

  function getValueFromInput(textQuery) {
    setTextQuery(textQuery);
  }

  function incrementPageNumber() {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  }

  return (
    <AppStyled>
      <Searchbar onSubmit={getValueFromInput} />

      {status === STATUS.PENDING && <Loader />}

      {status === STATUS.RESOLVED && (
        <ImageGallery images={images}></ImageGallery>
      )}

      {isButtonExist && (
        <Button
          incrementPageNumber={incrementPageNumber}
          disabled={status === STATUS.PENDING}
        />
      )}

      {status === STATUS.REJECTED && alert('Error')}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AppStyled>
  );
}
