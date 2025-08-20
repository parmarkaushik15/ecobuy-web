'use client';
import React, { useState, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// mui
import {
  Stack,
  TextField,
  Typography,
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

export default function MapPickerDialog({ open, onClose, googleMapApiKey, onSelectLocation, isLoading, dialogKey }) {
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
      setMapError(null);
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
            address: address || placeDetails.formatted_address,
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
}

MapPickerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  googleMapApiKey: PropTypes.string,
  onSelectLocation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dialogKey: PropTypes.string.isRequired
};
