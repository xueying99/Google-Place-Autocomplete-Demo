import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { addLocation } from './store/locations/locations';
import { useRef, useEffect } from 'react';
import { Container, Box, Grid, Input, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { google } from 'google-maps'
import Geocode from 'react-geocode';
import './App.css';

const INITIAL_LAT = 3.1466;
const INITIAL_LONG = 101.6958;

const GoogleMapsComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: INITIAL_LAT, lng: INITIAL_LONG }}>
      {props.isMarkerShown && (
        <Marker position={{ lat: INITIAL_LAT, lng: INITIAL_LONG }} />
      )}
    </GoogleMap>
  ))
);

const App = () => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: 'my' },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"]
  };

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autoCompleteRef.current.addListener('place_changed', async function () {
      const place = await autoCompleteRef.current.getPlace();
      const location_name = place.name;
      console.log({ place, location_name });
      getLatLong(inputRef.current.value);
    });
  }, []);

  const [locationName, setLocation] = useState('');
  const locations = [...useSelector(state => state.locations)].sort((a, b) => {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  });
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    var address = inputRef.current.value;
    dispatch(addLocation(address))
    setLocation('');
    getLatLong(address);
  };

  const getLatLong = (window, google, address) => {
    var geocoder = new google.maps.Geocoder();
    var result = "";
    var result_lat = "";
    var result_lng = "";
    console.log("address", address)
    geocoder.geocode({ 'address': address, 'region': 'my' },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          result_lat = results[0].geometry.location.Pa;
          result_lng = results[0].geometry.location.Qa;
        } else {
          result = "Unable to find address: " + status;
        }
        console.log("result", result_lat, result_lng)
        INITIAL_LAT = result_lat;
        INITIAL_LONG = result_lng;
      });
  }

  const resetInput = () => {
    inputRef.current.value = '';
  }

  return (
    <div>
      <Container maxWidth={false}>
        <div className='welcomeDiv'>
          Welcome to Khoo Xue Ying's assessment demo !
          <p>*This application is strictly allow for searching location within Malaysia only.</p>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box display='flex' justifyContent="center" height="20vh">
              <form onSubmit={handleSubmit}>
                <div className='locationDiv'>
                  <label className='label'>Enter Location:</label>
                  <Input inputRef={inputRef} padding={0} placeholder="Search"
                    onChange={e => setLocation(e.target.value)} />
                </div>
                <div className='buttonDiv'>
                  <Button type='submit' color='success' onClick={handleSubmit}>
                    <SearchIcon /> Search
                  </Button>
                  <Button type='submit' color="error" variant="outlined" onClick={resetInput}>
                    <DeleteOutlineIcon /> Reset
                  </Button>
                </div>
              </form>
            </Box>
            <div className='mapDiv'>
              <GoogleMapsComponent
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaknIdFRllxXELpZoCUiMIOdxX75XAFc4&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `320px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </div>

          </Grid>
          <Grid item xs={4}>
            <div className='listingDiv'>
              <h4>Search History</h4>
              <div>
                <ul>
                  {locations.map(location => (
                    <li key={location.name}>
                      <p>{location.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>

    </div>
  );
};

export default App;
