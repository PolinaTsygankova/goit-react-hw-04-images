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
    setTextQuery('');
  }, [textQuery]);

  useEffect(() => {
    fetchToGallery(textQuery, currentPage)
      .then(res => {
        if (res.total === 0) {
          toast.error(`Sorry, we don't have images with ${textQuery}`);
        }
        if (images !== []) {
          setImages(prevImages => [...prevImages.images, ...res.hits]);
        }

        setIsButtonExist(currentPage < Math.ceil(res.total / 12));
        setStatus(STATUS.RESOLVED);
      })
      .catch(error => {
        setErrorMessage(error.message);
        setStatus(STATUS.REJECTED);
      });
  }, [textQuery, currentPage, images]);

  function getValueFromInput(textQuery) {
    setTextQuery(textQuery);
  }

  function incrementPageNumber() {
    setCurrentPage(prevState => ({
      currentPage: prevState.currentPage + 1,
    }));
  }

  return (
    <AppStyled>
      <Searchbar onSubmit={getValueFromInput} />

      {status === STATUS.PENDING && <Loader />}

      {status === STATUS.RESOLVED && (
        <ImageGallery images={images}></ImageGallery>
      )}

      {isButtonExist && <Button incrementPageNumber={incrementPageNumber} />}

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

//!---------------------------------------------------------------------
// const STATUS = {
//   IDLE: 'idle',
//   PENDING: 'pending',
//   REJECTED: 'rejected',
//   RESOLVED: 'resolved',
// };

// const INITIAL_STATE = {
//   images: [],
//   errorMessage: '',
//   currentPage: 1,
//   status: STATUS.IDLE,
//   isButtonExist: false,
//   textQuery: '',
// };

// export class App extends React.Component {
//   state = INITIAL_STATE;

//   componentDidUpdate(prevProps, prevState) {
//     const { textQuery, currentPage } = this.state;

//     if (prevState.textQuery !== textQuery) {
//       this.setState({
//         images: [],
//         currentPage: 1,
//         INITIAL_STATE,
//         status: STATUS.PENDING,
//       });
//     }

//     if (
//       textQuery !== prevState.textQuery ||
//       currentPage !== prevState.currentPage
//     ) {
//       fetchToGallery(textQuery, currentPage)
//         .then(res => {
//           if (res.total === 0) {
//             toast.error(`Sorry, we don't have images with ${textQuery}`);
//           }
//           this.setState(prevState => ({
//             images: [...prevState.images, ...res.hits],
//             isButtonExist: currentPage < Math.ceil(res.total / 12),
//             status: STATUS.RESOLVED,
//           }));
//         })
//         .catch(error => {
//           this.setState({
//             errorMessage: error.message,
//             status: STATUS.REJECTED,
//           });
//         });
//     }
//   }

//   getValueFromInput = textQuery => {
//     this.setState({ textQuery });
//   };

//   incrementPageNumber = () => {
//     this.setState(prevState => ({
//       currentPage: prevState.currentPage + 1,
//     }));
//   };

//   render() {
//     const { images, status, isButtonExist } = this.state;
//     return (
//       <AppStyled>
//         <Searchbar onSubmit={this.getValueFromInput} />

//         {status === STATUS.PENDING && <Loader />}

//         {status === STATUS.RESOLVED && (
//           <ImageGallery images={images}></ImageGallery>
//         )}

//         {isButtonExist && (
//           <Button incrementPageNumber={this.incrementPageNumber} />
//         )}

//         {status === STATUS.REJECTED && alert('Error')}

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//       </AppStyled>
//     );
//   }
// }
