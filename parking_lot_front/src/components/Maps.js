import React,{Component, useState, useEffect, useRef} from 'react'
import {useParams} from "react-router-dom"
// import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import { GoogleMap, useLoadScript,InfoWindow, Marker } from '@react-google-maps/api';

import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import { Grid, TextField, Button } from '@material-ui/core'
import Form from "react-validation/build/form"
import LotsService from "../services/lots"
import { makeStyles } from '@material-ui/core/styles';

Geocode.setApiKey(process.env.REACT_APP_MAPS_CODE)
Geocode.enableDebug()

const useStyles = makeStyles({
	map:{
		width:"100%"
	},
	form:{
	  padding:10
	}
   
  });
var libraries= ["places","geometry"]
const center = {
	lat: 43.6532,
	lng: -79.3832,
  };
const Maps =( props )=>{
	const id=props.match.params.id
	const [address, setAddress]=useState("");
	const [geocode, setGeocode]=useState('');
	const [slots, setSlots]=useState(0);
		
	const [mapPosition,setMapPosition]= useState(
			{
				lat: props.center.lat,
				lng: props.center.lng
			}
			);
	const [markerPosition, setMarkerPosition]= useState({
				lat: props.center.lat,
				lng: props.center.lng
			});
		
	
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	useEffect(()=> {
        console.log(process.env.REACT_APP_MAPS_CODE)
		setStuff()
	}, )
	const setStuff= ()=>{
		Geocode.fromLatLng( mapPosition.lat , mapPosition.lng ).then(
			response => {
				setAddress( response.results[0].formatted_address)
				setGeocode( response.results[0].place_id)

			

				
			},
			error => {
				console.error( error );
			}
		);
	}

	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	
	/**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	// getCity = ( addressArray ) => {
	// 	let city = '';
	// 	for( let i = 0; i < addressArray.length; i++ ) {
	// 		if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
	// 			city = addressArray[ i ].long_name;
	// 			return city;
	// 		}
	// 	}
	// };
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	// getArea = ( addressArray ) => {
	// 	let area = '';
	// 	for( let i = 0; i < addressArray.length; i++ ) {
	// 		if ( addressArray[ i ].types[0]  ) {
	// 			for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
	// 				if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
	// 					area = addressArray[ i ].long_name;
	// 					return area;
	// 				}
	// 			}
	// 		}
	// 	}
	// };
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */

	const saveOrUpdateLot = (e) => {
        e.preventDefault();
        let lot = {address: address, geocode: geocode, slots: slots, lat: markerPosition.lat, lng: markerPosition.lng};
        console.log('lots => ' + JSON.stringify(lot));

		// step 5
		console.log(props)
        if(id === '_add'){
            LotsService.createLots(lot).then(res =>{
                props.history.push('/lots');
            });
        }else{
            LotsService.updateLots(lot, id).then( res => {
                props.history.push('/lots');
            });
        }
    }
	// getState = ( addressArray ) => {
	// 	let state = '';
	// 	for( let i = 0; i < addressArray.length; i++ ) {
	// 		for( let i = 0; i < addressArray.length; i++ ) {
	// 			if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
	// 				state = addressArray[ i ].long_name;
	// 				return state;
	// 			}
	// 		}
	// 	}
	// };
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	
	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	const onInfoWindowClose = ( event ) => {

	};

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	const onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				setAddress(response.results[0].formatted_address)
				      
				setGeocode(response.results[0].place_id)
				
				setMarkerPosition({lat: newLat,lng: newLng})
				setMapPosition({lat: newLat,lng: newLng})
				

			},
			error => {
				console.error(error);
			}
		);
	};
	
	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	const onPlaceSelected = ( place ) => {
		console.log( 'plc', place );
		setAddress(place.formatted_address)
		      
		setGeocode(place.place_id)
		setMarkerPosition({lat:place.geometry.location.lat(),lng:place.geometry.location.lng()})
		setMapPosition({lat:place.geometry.location.lat(),lng:place.geometry.location.lng()})
		
	};


	
		const classes = useStyles();
		const form = useRef();	
		const containerStyle = {
			width: '100vw',
			height: '100vh'
		  };
		  
					
		
		const { isLoaded, loadError } = useLoadScript({
			googleMapsApiKey: process.env.REACT_APP_MAPS_CODE,
			libraries,
		  });
		if(loadError) return "Load Error"
		if(!isLoaded) return "Not loaded"
		let map;
		if( props.center.lat !== undefined ) {
			map = <div style={{width:'100%'}}>
				
				<Form onSubmit={saveOrUpdateLot} ref={form}>
					
					<Grid className={classes.form}>
                          
						  <TextField
							label='Address'
							value={ address}
							onChange={event => setAddress(event.target.value)}
							variant='outlined'

							required
						  />
					  </Grid>
					  <Grid className={classes.form}>
                          
						  <TextField
							label='Geocode'
							value={geocode}
							onChange={event => setGeocode(event.target.value)}
							variant='outlined'
							autoFocus={true}
							required
						  />
					  </Grid>
					  <Grid className={classes.form}>
                          
						  <TextField
							label='Slots'
							value={ slots}
							onChange={event => setSlots(event.target.value)}
							variant='outlined'

							required
						  />
					  </Grid>
				

<Button variant="outlined" type="submit" color="primary" style={{ textTransform: "none" }}>
                            Submit
                            </Button>
				</Form>
				
					
					<div>
						<GoogleMap 
								mapContainerStyle={containerStyle}
						           zoom={ props.zoom }
						           center={props.center}
						>
							{/* InfoWindow on top of marker */}
							<InfoWindow
								onClose={onInfoWindowClose}
								position={{ lat: ( markerPosition.lat + 0.0018 ), lng: markerPosition.lng }}
							>
								<div>
									<span style={{ padding: 0, margin: 0 }}>{ address }</span>
								</div>
							</InfoWindow>
							{/*Marker*/}
							<Marker 
							        name={'Dolores park'}
							        draggable={true}
							        onDragEnd={ onMarkerDragEnd }
							        position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
							/>
							<Marker />
							{/* For Auto complete Search Box */}
							<Autocomplete
								style={{
									position:"relative",
									width: '40vw',
									height: '40px',
									paddingLeft: '16px',
									marginTop: "90vh",
									marginBottom: '10px'
								}}
								onPlaceSelected={ onPlaceSelected }
								types={['(regions)']}
							/>
						</GoogleMap>
					</div>
					
					
				
			</div>
		} else {
			map = <div style={{height: props.height}} />
		}
		return( map )
	}

export default React.memo(Maps, 
	( props, nextProps )=>{
		if (
			Maps.markerPosition.lat !== props.center.lat
		) {
			return true
		} else if ( props.center.lat === nextProps.center.lat ){
			return false
		}
	}
	)
