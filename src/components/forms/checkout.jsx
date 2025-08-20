'use client';
import React, { useState, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// mui
import {
  Stack,
  TextField,
  Card,
  CardHeader,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Autocomplete,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { IoCloseCircleOutline, IoArrowBack } from 'react-icons/io5';
// countries
import countries from '../_main/checkout/countries.json';

const MapPickerDialog = ({ open, onClose, googleMapApiKey, onSelectLocation, isLoading, dialogKey }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const geocoderRef = useRef(null);

  useLayoutEffect(() => {
    if (!open) {
      setMapLoading(false);
      setMapError(null); // Clear error when dialog is closed
      setSelectedLocation(null);
      setSearch('');
      return;
    }

    if (!googleMapApiKey) {
      setMapLoading(false);
      setMapError('Missing Google Maps API key');
      return;
    }

    const loadScript = () => {
      if (window.google && window.google.maps) {
        initMapWithRetry();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapApiKey}&libraries=places&callback=initMapCallback`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setMapError('Failed to load Google Maps. Please check your API key or network connection.');
        setMapLoading(false);
      };
      document.head.appendChild(script);

      window.initMapCallback = () => {
        initMapWithRetry();
      };

      const timeoutId = setTimeout(() => {
        if (!window.google || !window.google.maps) {
          setMapError('Failed to load Google Maps. Please check your API key or network connection.');
          setMapLoading(false);
        }
      }, 10000);

      return () => clearTimeout(timeoutId);
    };

    const initMap = () => {
      if (!mapRef.current) {
        throw new Error('Map container not found');
      }

      try {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20.5937, lng: 78.9629 },
          zoom: 5,
          mapTypeControl: false,
          streetViewControl: false
        });

        markerRef.current = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          draggable: true
        });

        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(mapInstanceRef.current);
        geocoderRef.current = new window.google.maps.Geocoder();

        mapInstanceRef.current.addListener('click', (event) => {
          const latLng = event.latLng;
          markerRef.current.setPosition(latLng);
          reverseGeocode({ lat: latLng.lat(), lng: latLng.lng() });
        });

        markerRef.current.addListener('dragend', () => {
          const position = markerRef.current.getPosition();
          reverseGeocode({ lat: position.lat(), lng: position.lng() });
        });

        setMapLoading(false);
        setMapError(null);
      } catch (error) {
        setMapError('Failed to initialize map. Please try again.');
        setMapLoading(false);
      }
    };

    const initMapWithRetry = (retryCount = 0, maxRetries = 5) => {
      if (!window.google || !window.google.maps) {
        if (retryCount < maxRetries) {
          setTimeout(() => {
            initMapWithRetry(retryCount + 1, maxRetries);
          }, 200);
        } else {
          setMapError('Google Maps API not available after multiple attempts. Please try again.');
          setMapLoading(false);
        }
        return;
      }

      if (mapRef.current) {
        initMap();
      } else if (retryCount < maxRetries) {
        setTimeout(() => {
          initMapWithRetry(retryCount + 1, maxRetries);
        }, 200);
      } else {
        setMapError('Map container not found after multiple attempts. Please try again.');
        setMapLoading(false);
      }
    };

    loadScript();

    return () => {
      const scripts = document.querySelectorAll(`script[src*="maps.googleapis.com"]`);
      scripts.forEach((script) => script.remove());
      delete window.initMapCallback;
      setMapLoading(true);
      setMapError(null);
      setSelectedLocation(null);
      setSearch('');
    };
  }, [open, googleMapApiKey, dialogKey]);

  const reverseGeocode = (latLng) => {
    if (!geocoderRef.current) {
      setMapError('Geocoder service not available.');
      return;
    }

    geocoderRef.current.geocode({ location: latLng }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const addressComponents = results[0].address_components || [];
        let address = '';
        let city = '';
        let state = '';
        let postalCode = '';
        let country = '';

        const addressParts = [];
        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes('premise') || types.includes('subpremise')) {
            addressParts.push(component.long_name);
          } else if (types.includes('route')) {
            addressParts.push(component.long_name);
          } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
            addressParts.push(component.long_name);
          } else if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (types.includes('postal_code')) {
            postalCode = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
            const countryMatch = countries.find((c) => c.label === country || c.code === component.short_name);
            country = countryMatch ? countryMatch.label : country;
          }
        });

        address = addressParts.filter((part) => part).join(', ');

        const locationData = {
          address: address || results[0].formatted_address,
          city,
          state,
          zip: postalCode,
          country
        };

        setSelectedLocation(locationData);
        setSearch(results[0].formatted_address);
        mapInstanceRef.current.setCenter(latLng);
        mapInstanceRef.current.setZoom(15);
      } else {
        setMapError('Unable to find address for this location. Please try another spot.');
      }
    });
  };

  const handleSearchChange = (event, newValue) => {
    if (!newValue) {
      setSearch('');
      setSuggestions([]);
      return;
    }

    if (typeof newValue === 'string') {
      setSearch(newValue);
    } else {
      handlePlaceSelection(newValue);
    }

    if (autocompleteServiceRef.current && newValue) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: typeof newValue === 'string' ? newValue : newValue.description,
          types: ['geocode'],
          componentRestrictions: { country: 'in' }
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(
              predictions.map((pred) => ({
                description: pred.description,
                place_id: pred.place_id
              }))
            );
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  };

  const handlePlaceSelection = (place) => {
    placesServiceRef.current.getDetails(
      { placeId: place.place_id, fields: ['address_components', 'geometry', 'formatted_address'] },
      (placeDetails, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const location = {
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng()
          };

          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(15);
          markerRef.current.setPosition(location);

          const addressComponents = placeDetails.address_components || [];
          let address = '';
          let city = '';
          let state = '';
          let postalCode = '';
          let country = '';

          // Build address from specific components
          const addressParts = [];
          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes('premise') || types.includes('subpremise')) {
              addressParts.push(component.long_name);
            } else if (types.includes('route')) {
              addressParts.push(component.long_name);
            } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
              addressParts.push(component.long_name);
            } else if (types.includes('locality')) {
              city = component.long_name; // Set city for locationData, but exclude from address
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
              const countryMatch = countries.find((c) => c.label === country || c.code === component.short_name);
              country = countryMatch ? countryMatch.label : country;
            }
          });

          // Construct address by joining relevant components (street_number, route, sublocality)
          address = addressParts.filter((part) => part).join(', ');

          const locationData = {
            address: address || placeDetails.formatted_address, // Fallback to formatted_address if no parts are found
            city,
            state,
            zip: postalCode,
            country
          };

          setSelectedLocation(locationData);
          setSearch(placeDetails.formatted_address);
        } else {
          setMapError('Failed to retrieve location details. Please try again.');
        }
      }
    );
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      key={dialogKey}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
          position: 'relative'
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <IconButton onClick={onClose}>
            <IoArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
            Select Location
          </Typography>
          <IconButton onClick={onClose} edge="end">
            <IoCloseCircleOutline />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ overflow: 'visible', position: 'relative', padding: 0 }}>
        {mapError && !mapLoading && (
          <Alert severity="error" sx={{ mb: 2, mx: 2 }}>
            {mapError} You can still enter the address manually in the form.
          </Alert>
        )}
        <Stack
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1300,
            width: 'calc(100% - 32px)',
            maxWidth: 400
          }}
        >
          <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            onInputChange={handleSearchChange}
            onChange={(event, value) => {
              if (value && typeof value !== 'string') {
                handlePlaceSelection(value);
              }
            }}
            inputValue={search}
            disabled={isLoading || mapLoading || mapError}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
              '& .MuiAutocomplete-option': {
                '&.Mui-focused': {
                  backgroundColor: 'primary.main',
                  color: 'common.white'
                }
              }
            }}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  mt: 0.5,
                  boxShadow: 3,
                  '& .MuiAutocomplete-listbox': {
                    maxHeight: 200,
                    '& .MuiAutocomplete-option': {
                      '&.Mui-focused': {
                        backgroundColor: 'primary.dark',
                        color: 'common.white'
                      }
                    }
                  }
                }}
              >
                {children}
              </Paper>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                id="map-search-input"
                placeholder="Search for a location"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  style: {
                    backgroundColor: 'background.paper',
                    borderRadius: '8px'
                  }
                }}
              />
            )}
          />
        </Stack>
        <div ref={mapRef} style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
          {mapLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </div>
          )}
        </div>
        {selectedLocation && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmLocation}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1300,
              borderRadius: '20px',
              px: 4,
              py: 1.5,
              boxShadow: 3,
              '&:hover': {
                color: 'common.white'
              }
            }}
          >
            Confirm Location
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

MapPickerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  googleMapApiKey: PropTypes.string,
  onSelectLocation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dialogKey: PropTypes.string.isRequired
};

// The rest of the CheckoutGuestForm component remains unchanged
export default function CheckoutGuestForm({
  getFieldProps,
  touched,
  errors,
  handleChangeShipping,
  checked,
  isLoading,
  setFieldValue,
  googleMapApiKey
}) {
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [dialogKey, setDialogKey] = useState(Date.now().toString());

  const handleSelectLocation = (location) => {
    if (location) {
      setFieldValue('address', location.address || '');
      setFieldValue('city', location.city || '');
      setFieldValue('state', location.state || '');
      setFieldValue('zip', location.zip || '');
      setFieldValue('country', location.country || 'India');
    }
    setOpenMapDialog(false);
    setDialogKey(Date.now().toString());
  };

  return (
    <>
      <MapPickerDialog
        open={openMapDialog}
        onClose={() => {
          setOpenMapDialog(false);
          setDialogKey(Date.now().toString());
        }}
        googleMapApiKey={googleMapApiKey}
        onSelectLocation={handleSelectLocation}
        isLoading={isLoading}
        dialogKey={dialogKey}
      />
      <Card
        sx={{
          borderRadius: '8px',
          boxShadow: 'unset'
        }}
      >
        <CardHeader title={<Typography variant="h4">Billing Detail</Typography>} />
        <Stack spacing={{ xs: 2, sm: 3 }} p={3} mt={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" for="firstName" component={'label'}>
                First Name
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                type="text"
                disabled={isLoading}
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" for="lastName" component={'label'}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                type="text"
                disabled={isLoading}
              />
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" for="email" component={'label'}>
                Email
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                disabled={isLoading}
              />
            </Stack>
            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" for="phone" component={'label'}>
                Phone
              </Typography>
              <TextField
                fullWidth
                id="phone"
                type="text"
                {...getFieldProps('phone')}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
                disabled={isLoading}
              />
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" component="label" htmlFor="address">
                Address
              </Typography>
              <TextField
                fullWidth
                id="address"
                {...getFieldProps('address')}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
                disabled={isLoading}
              />
            </Stack>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                setOpenMapDialog(true);
                setDialogKey(Date.now().toString());
              }}
              disabled={isLoading || !googleMapApiKey}
              sx={{
                height: { xs: '48px', sm: '57px' },
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  color: 'common.white'
                }
              }}
            >
              Map
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" for="city" component={'label'}>
                Town City
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('city')}
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && errors.city}
                disabled={isLoading}
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" for="state" component={'label'}>
                State
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('state')}
                error={Boolean(touched.state && errors.state)}
                helperText={touched.state && errors.state}
                disabled={isLoading}
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" for="zip" component={'label'}>
                Zip/Postal Code
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('zip')}
                error={Boolean(touched.zip && errors.zip)}
                helperText={touched.zip && errors.zip}
                type="number"
                disabled={isLoading}
              />
            </Stack>
          </Stack>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" for="country" component={'label'}>
              Country
            </Typography>
            <TextField
              select
              fullWidth
              placeholder="Country"
              {...getFieldProps('country')}
              SelectProps={{ native: true }}
              error={Boolean(touched.country && errors.country)}
              helperText={touched.country && errors.country}
              disabled={isLoading}
            >
              {countries.map((option) => (
                <option key={option.code} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" for="note" component={'label'}>
              Note
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              id="note"
              {...getFieldProps('note')}
              error={Boolean(touched.note && errors.note)}
              helperText={touched.note && errors.note}
              type="text"
              disabled={isLoading}
            />
          </Stack>
          <FormControlLabel
            control={<Checkbox onChange={handleChangeShipping} checked={checked} disabled={isLoading} />}
            label="Ship to a different address?"
          />
        </Stack>
      </Card>
    </>
  );
}

CheckoutGuestForm.propTypes = {
  getFieldProps: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChangeShipping: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  googleMapApiKey: PropTypes.string
};
