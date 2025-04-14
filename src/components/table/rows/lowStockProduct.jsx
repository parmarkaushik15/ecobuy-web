import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import { enUS } from 'date-fns/locale';

// mui
import { capitalize } from 'lodash';
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Rating,
  Tooltip,
  useTheme
} from '@mui/material';

// redux
import { fCurrency } from 'src/utils/formatNumber';
import { fDateShort } from 'src/utils/formatTime';

// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';
// icons
export default function ProductRow({ isLoading, row, handleClickOpen, isVendor }) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: '5px' }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                mr: 2,
                border: (theme) => '1px solid ' + theme.palette.divider,
                borderRadius: '5px',
                img: {
                  borderRadius: '5px'
                }
              }}
            >
              <BlurImage
                alt={row?.name}
                placeholder="blur"
                blurDataURL={row?.image.blurDataURL}
                src={process.env.IMAGE_BASE == 'LOCAL' ? `${process.env.IMAGE_URL}${row?.image.url}` : row?.image.url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>
      {/* <TableCell>
        <Skeleton variant="text" />
      </TableCell> */}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{fDateShort(row?.createdAt, enUS)}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.available}</TableCell>
      <TableCell align="left">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Rating name="text-feedback" size="small" value={row?.averageRating || 0} readOnly precision={0.5} />
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row?.priceSale || row?.price)}</TableCell>
    </TableRow>
  );
}
ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,

  row: PropTypes.shape({
    image: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    available: PropTypes.number,
    averageRating: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    price: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,

  handleClickOpen: PropTypes.func.isRequired
};
