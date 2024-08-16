import PropTypes from 'prop-types';
import { sum } from 'lodash';
import { useSelector } from 'react-redux';
import { useRouter } from 'next-nprogress-bar';

// mui
import { IconButton, Stack, Badge } from '@mui/material';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

// custom hooks
export default function CartWidget() {
  const {
    checkout: { cart }
  } = useSelector(({ product }) => product);
  const router = useRouter();
  const totalItems = sum(cart?.map((item) => item.quantity));
  return (
    <Stack
      onClick={() => router.push('/cart')}
      direction="row"
      spacing={1}
      alignItems="center"
      width="auto"
      sx={{
        cursor: 'pointer'
      }}
    >
      <Badge badgeContent={totalItems} color="primary">
        <IconButton name="cart" disableRipple color="primary">
          <HiOutlineShoppingBag />
        </IconButton>
      </Badge>
    </Stack>
  );
}
CartWidget.propTypes = {
  checkout: PropTypes.object.isRequired
};
