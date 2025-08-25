'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setConsent } from 'src/redux/slices/user';
import { createCookies } from 'src/hooks/cookies';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Checkbox,
    Typography,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

const BannerContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
}));

export default function CookieConsentBanner() {
    const dispatch = useDispatch();
    const { consent } = useSelector((state) => state.user);
    const [openModal, setOpenModal] = useState(false);
    const [analyticsConsent, setAnalyticsConsent] = useState(true);

    // Hide banner if consent is already set
    const showBanner = !consent;

    const handleAcceptAll = () => {
        const consentData = { essential: true, analytics: true };
        dispatch(setConsent(consentData));
        createCookies('cookieConsent', JSON.stringify(consentData), { maxAge: 365 * 24 * 60 * 60 });
    };

    const handleRejectNonEssential = () => {
        const consentData = { essential: true, analytics: false };
        dispatch(setConsent(consentData));
        createCookies('cookieConsent', JSON.stringify(consentData), { maxAge: 365 * 24 * 60 * 60 });
    };

    const handleSavePreferences = () => {
        const consentData = { essential: true, analytics: analyticsConsent };
        dispatch(setConsent(consentData));
        createCookies('cookieConsent', JSON.stringify(consentData), { maxAge: 365 * 24 * 60 * 60 });
        setOpenModal(false);
    };

    if (!showBanner) return null;

    return (
        <>
            <BannerContainer>
                <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 }, maxWidth: '600px' }}>
                    We use cookies to enhance your experience. Essential cookies are required for functionality, while analytics
                    cookies help us improve our services.{' '}
                    <a href="/privacy-policy" style={{ color: 'inherit' }}>
                        Learn more
                    </a>
                    .
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="contained" color="primary" onClick={handleAcceptAll}>
                        Accept All
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleRejectNonEssential}>
                        Reject Non-Essential
                    </Button>
                    <Button variant="text" color="primary" onClick={() => setOpenModal(true)}>
                        Customize
                    </Button>
                </Stack>
            </BannerContainer>

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Manage Cookie Preferences</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <FormControlLabel
                            control={<Checkbox checked disabled />}
                            label="Essential Cookies (Required for site functionality)"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={analyticsConsent} onChange={(e) => setAnalyticsConsent(e.target.checked)} />}
                            label="Analytics Cookies (Help us improve our services)"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSavePreferences}>
                        Save Preferences
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
