// react
'use client';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import BlurImage from 'src/components/blurImage';
// mui
import { Box, Stack, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';
// styles
import RootStyled from './styled';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

// ----------------------------------------------------------------------
ProductDetailsCarousel.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number,
  onClick: PropTypes.func
};

function ProductDetailsCarousel({ item, index, onClick }) {
  const videoRef = useRef(null);
  const isVideo = item?.url?.endsWith('.mp4');
  let imageUrl = item?.url || item?.src;
  if (process.env.IMAGE_BASE === 'LOCAL' && !imageUrl.startsWith('http')) {
    imageUrl = `${process.env.IMAGE_URL}${imageUrl}`;
  }

  if (isVideo) {
    return (
      <div
        className="slide-wrapper"
        style={{
          display: 'contents',
          height: '200px',
          marginTop: '43px',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        <video
          ref={videoRef}
          style={{
            width: 'calc(100% - 16px)',
            height: 'calc(100% - 16px)',
            objectFit: 'cover',
            borderRadius: '5px',
            border: '1px solid divider'
          }}
          controls
          autoPlay
          muted
          loop
        >
          <source src={imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="slide-wrapper" onClick={onClick} style={{ cursor: 'pointer' }}>
      {item && (
        <>
          <BlurImage
            priority
            fill
            objectFit="cover"
            sizes="50%"
            src={imageUrl}
            alt="hero-carousel"
            placeholder="blur"
            blurDataURL={item.blurDataURL}
          />
          <Box className="bg-overlay" />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <ZoomInIcon />
          </IconButton>
        </>
      )}
    </div>
  );
}

export default function CarouselAnimation({ product }) {
  const images = product?.images || [];
  const video = product?.video;
  const media = video ? [...images, video] : images;
  const [[page, direction], setPage] = useState([0, 0]);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const mediaIndex = Math.max(0, Math.min(page, media.length - 1));

  const paginate = (newDirection) => {
    const newPage = mediaIndex + newDirection;
    if (newPage >= 0 && newPage < media.length) {
      setPage([newPage, newDirection]);
    }
  };

  const handleOpenModal = (index) => {
    setModalImageIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePrev = () => {
    setModalImageIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleNext = () => {
    setModalImageIndex((prev) => (prev + 1) % media.length);
  };

  return (
    <RootStyled>
      <div className="carousel-wrap">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            className="motion-dev"
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <ProductDetailsCarousel
              item={media[mediaIndex]}
              index={mediaIndex}
              onClick={() => handleOpenModal(mediaIndex)}
            />
          </motion.div>
        </AnimatePresence>
        <Stack
          direction="row"
          justifyContent={media.length < 6 ? 'center' : 'flex-start'}
          spacing={1}
          className="controls-wrapper"
          sx={{
            overflowX: 'auto',
            py: 1,
            '&::-webkit-scrollbar': {
              height: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'divider',
              borderRadius: '4px'
            }
          }}
        >
          {media.map((item, i) => {
            let imageUrl = item?.url || item?.src;
            if (process.env.IMAGE_BASE === 'LOCAL' && !imageUrl.startsWith('http')) {
              imageUrl = `${process.env.IMAGE_URL}${imageUrl}`;
            }
            const isVideo = item?.url?.endsWith('.mp4');
            return (
              <Box
                key={item._id || item.url || item.src || `media-${i}`}
                className={`controls-button ${mediaIndex === i ? 'active' : ''}`}
                onClick={() => {
                  const newDirection = i > mediaIndex ? 1 : -1;
                  setPage([i, newDirection]);
                }}
                sx={{
                  width: 60,
                  height: 60,
                  minWidth: 60,
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 1,
                  border: (theme) =>
                    mediaIndex === i ? `2px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.divider}`,
                  transition: 'border 0.3s ease-in-out',
                  '&:hover': {
                    border: (theme) => `2px solid ${theme.palette.primary.main}`
                  }
                }}
              >
                {isVideo ? (
                  <>
                    <video
                      width="100%"
                      height="100%"
                      muted
                      loop
                      style={{
                        objectFit: 'cover',
                        borderRadius: 'inherit'
                      }}
                    >
                      <source src={imageUrl} type="video/mp4" />
                    </video>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        '&:before': {
                          content: '""',
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                          borderLeft: '12px solid white'
                        }
                      }}
                    />
                  </>
                ) : (
                  <BlurImage
                    priority
                    fill
                    objectFit="cover"
                    sizes="14vw"
                    src={imageUrl}
                    alt="hero-carousel"
                    placeholder="blur"
                    blurDataURL={item.blurDataURL}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </div>

      {/* Modal for image/video preview */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '50vw',
            height: '65vh',
            maxWidth: '1200px',
            maxHeight: '800px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            outline: 'none'
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>

          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: 8,
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
            onClick={handlePrev}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
            onClick={handleNext}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {media[modalImageIndex]?.url?.endsWith('.mp4') ? (
              <video
                controls
                autoPlay
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              >
                <source
                  src={
                    process.env.IMAGE_BASE === 'LOCAL' && !media[modalImageIndex]?.url.startsWith('http')
                      ? `${process.env.IMAGE_URL}${media[modalImageIndex]?.url}`
                      : media[modalImageIndex]?.url
                  }
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={
                  process.env.IMAGE_BASE === 'LOCAL' && !media[modalImageIndex]?.url.startsWith('http')
                    ? `${process.env.IMAGE_URL}${media[modalImageIndex]?.url}`
                    : media[modalImageIndex]?.url
                }
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  cursor: 'zoom-in'
                }}
                onClick={(e) => {
                  if (e.target.style.transform === 'scale(1.5)') {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.cursor = 'zoom-in';
                  } else {
                    e.target.style.transform = 'scale(1.5)';
                    e.target.style.cursor = 'zoom-out';
                  }
                }}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </RootStyled>
  );
}

CarouselAnimation.propTypes = {
  product: PropTypes.object
};
