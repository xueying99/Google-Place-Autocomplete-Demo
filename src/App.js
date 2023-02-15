import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addLocation } from './store/locations/locations';
import { useRef, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import './App.css';

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
      console.log({ location_name });
    });
  }, []);

  const [locationName, setLocation] = useState('');
  const locations = [...useSelector(state => state.locations)].sort((a, b) => {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  });
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(addLocation(inputRef.current.value))
    setLocation('');
    console.log(inputRef.current.value);
    resetInput();
  };

  const resetInput = () => {
    inputRef.current.value = '';
  }

  return (
    <div>
      <Container maxWidth={false}>
        <Box height="95vh">
          <div className='welcomeDiv'>
            Welcome to Khoo Xue Ying's assessment demo !
            <p>*This application is strictly allow for searching location in Malaysia only.</p>
          </div>
          <Box display='flex' justifyContent="center" height="20vh">
            <form onSubmit={handleSubmit}>
              <div className='locationDiv'>
                <label className='label'>Enter Location:</label>
                <Input inputRef={inputRef} padding={0} placeholder="Search"
                  onChange={e => setLocation(e.target.value)} />
              </div>
              <Button type='submit' color='success'>
                <PlaylistAddIcon /> Add to List
              </Button>
            </form>
          </Box>
          <div className='listingDiv'>
            <h4>Location Listing (User Tries)</h4>
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
        </Box>
      </Container>

    </div>
  );
};

export default App;
