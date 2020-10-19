import React,{Component, useState, useEffect} from 'react'
import { GoogleMap, useLoadScript,InfoWindow, Marker } from '@react-google-maps/api';
import Geocode from "react-geocode";
import { Grid, TextField, Button } from '@material-ui/core'
import LotsService from '../services/lots'
import { makeStyles } from '@material-ui/core/styles'
Geocode.setApiKey(process.env.REACT_APP_MAPS_CODE)
Geocode.enableDebug()

const useStyles = makeStyles({
	
	form:{
	  padding:10
	}
   
  });
var libraries= ["places","geometry"]

const MapView =(props)=> {
    
	const [lots, setLots]=useState([])
	const [selectedLot, setSelectedLot]=useState(null)
	const [coor, setCoor]=useState({})
	const classes = useStyles();
	const park=[];
    const editlot=(id)=>{
        props.history.push(`/add-lot/${id}`);
    }

    useEffect(()=>{
        LotsService.getLots().then((res) => {
            setLots(res.data);
        
        });
        
     //    const script = document.createElement('script');

	    // script.src = "https://maps.googleapis.com/maps/api/js?key="+process.env.REACT_APP_MAPS_CODE+"&libraries=places";
	    // script.async = true;

	    // document.body.appendChild(script);

	    // return () => {
	    //   document.body.removeChild(script);
	    // }

    })
    const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_MAPS_CODE,
		libraries,
	  });

    
    const sendToBooking= () => {
    	props.history.push(
    		{pathname: '/book_lot',
    		 			state: selectedLot}
    		)
    }

    const addlots=()=>{
        props.history.push('/add-lots/_add');
    }
	const containerStyle = {
		width: '100vw',
		height: '100vh'
	  };
    // const setCoordinates=(geocode)=>{
    // 	geocodeByPlaceId(geocode)
				// 			.then(results => getLatLng(results[0]))
				// 			.then(({lat, lng})=> { 
				// 				console.log({lat, lng})
				// 				setCoor({lat,lng})})
    // }

	
	  if(loadError) return "Load Error"
	  if(!isLoaded) return "Not loaded"
	let map;
	if( props.center.lat !== undefined ) {
			map = <div>
		
		
			
		<GoogleMap mapContainerStyle={containerStyle}
							zoom={ props.zoom }
							center={props.center}
							
				>

				
					
					 {lots.map(lot => 
					 												
		 						(<Marker
		 							key={lot.id}
									
		 							position={{
		 								lat: lot.lat,
		 								lng: lot.lng                        
		 							}}
		 							onClick={() => {
		 								setSelectedLot(lot);
		 								console.log(selectedLot)
		 							}}																																														
									
		 							/>)
									
		 						)
		 					}
										
		
		 					{selectedLot &&(
								
		 						<InfoWindow
		 						
		 						onCloseClick={() => {
		 							setSelectedLot(null);
		 						}}
		 						position={{
		 							lat: (selectedLot.lat+ 0.0018),
		 							lng: (selectedLot.lng)
		 						}}
		 						>
		 						<div>
		 							<p>{selectedLot.address}</p>
		 							<Button variant="outlined" onClick={sendToBooking} color="primary" style={{ textTransform: "none" }}>
                            Submit
                            </Button>
		 						</div>
		 						</InfoWindow>
						)}
				
								
									
				
		</GoogleMap>

		
	</div>
	} else {
		map = <div style={{height: props.height}} />
	}
	return( map )
	}


export default React.memo(MapView)