import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const RootStyled = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .detail-card': {
    minHeight: 226,
    position: 'relative',
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    borderRadius: 0,
    '& .action-button': {
      position: 'absolute',
      bottom: theme.spacing(-1),
      right: theme.spacing(-1),
      zIndex: 10,
      [theme.breakpoints.down('sm')]: {
        minWidth: '40px !important',
        minHeight: '40px !important',
        padding: theme.spacing(1),
        '& .MuiButton-startIcon': {
          margin: 0
        },
        '& .MuiButton-label': {
          display: 'none'
        }
      }
    },
    '& .detail-card-content': {
      position: 'relative',
      padding: theme.spacing(3)
    },
    '& .detail-card-btn': {
      display: 'block',
      minWidth: 50,
      lineHeight: 0,
      minHeight: 50,
      color: theme.palette.common.white,
      background: theme.palette.primary.main,
      boxShadow: theme.shadows[2],
      '&:hover': {
        background: theme.palette.primary.dark
      }
    },
    '& .email-heading': {
      wordWrap: 'break-word'
    },
    '& .timeline': {
      padding: 0,
      margin: 0,
      '& .timeline-opposite': {
        flex: 0.3,
        paddingRight: theme.spacing(1),
        color: theme.palette.text.secondary
      },
      '& .timeline-dot': {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        margin: 0,
        position: 'relative',
        '&.current-status': {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            border: `10px solid ${theme.palette.primary.main}`, // Thinner border with theme color
            borderRadius: '50%',
            zIndex: -1,
            animation: 'pulse 1.5s infinite ease-in-out'
          }
        }
      },
      '& .timeline-connector': {
        background: theme.palette.primary.light
      },
      '& .card-text': {
        color: theme.palette.text.primary
      }
    }
  },
  '& .skeleton': {
    marginLeft: 'auto'
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.7
    },
    '50%': {
      transform: 'scale(1.2)',
      opacity: 0.3
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.7
    }
  }
}));

export default RootStyled;
