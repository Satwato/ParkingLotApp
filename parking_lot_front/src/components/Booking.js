
import React,{useState, useEffect} from 'react'
import { Grid, TextField, Card, Button, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import AuthService from "../services/auth.service";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import BookingService from '../services/BookingService'
import axios from 'axios'



const useStyles = makeStyles({
	
	form:{
	  padding:10
	}

   
  });
const Booking =( props )=>{
	const classes = useStyles();
	console.log(props)
	const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());
	const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
	const [message, setMessage] = useState("");
	const [success, setSuccess] = useState("");
	
	  const handleEndDateChange = (date) => {
	    setSelectedEndDate(date);
	  };
	  const handleStartDateChange = (date) => {
	    setSelectedStartDate(date);
	  };
	const onSubmit= ()=>{
		axios.post()
	}
	const currentUser = AuthService.getCurrentUser();
	const paymentHandler = async (e) => {
	//const API_URL = 'http://localhost:8000/'
		e.preventDefault();
		//const orderUrl = `${API_URL}order`;
		var booking={
			starttime:parseInt((selectedStartDate.getTime() / 1000).toFixed(0)),
			endtime:parseInt((selectedEndDate.getTime() / 1000).toFixed(0)),
			geocode: props.history.location.state.geocode,
			username: currentUser.username,
			type:"test"
		}
		try{
			const response = await BookingService.createBooking(booking);
				const { data } = response;
				console.log(process.env.REACT_APP_RAZOR_PAY_TEST_KEY)
				console.log(data)
				const options = {
				  key: process.env.REACT_APP_RAZOR_PAY_TEST_KEY,
				  name: "ParkingLot App",
				  amount: parseInt(data.amount),
				  order_id: data.order_id,
				  handler: async (response) => {
				    try {
				     booking['payment_id']= response.razorpay_payment_id;
				     booking['order_id']= response.razorpay_order_id;
				     booking['signature']= response.razorpay_signature;
				     booking['type']='final';
				     const captureResponse = await BookingService.createBooking(booking);
				     console.log(captureResponse.data.status)
				     console.log(captureResponse.data.status=="Booked")
				     if (captureResponse.data.status=="Booked"){
				     	setSuccess("Parking space booked")
				     }
				     else{
				     	setMessage("Unable to verify transaction")
				     }
				    } catch (error) {
				      const resMessage =
			            (error.response &&
			              error.response.data &&
			              error.response.data.message) ||
				        error.message ||
				        error.toString();

			          setMessage(resMessage);
				    }
				  },  theme: {
				    color: "#686CFD",
				  },
				};
				const rzp1 = new window.Razorpay(options);
				rzp1.open();
		}
		catch (error){
			const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
	        error.message ||
	        error.toString();

          setMessage(resMessage);
		}
	};

	return (

			 <Grid  container justify="center" alignItems="center">
			 {message && (
			   <Alert severity="error">{message}</Alert>
			 )}
			 	<Card className={classes.card} xs={6}>
			 		<Typography variant="h6" gutterBottom>
				        Select Start Date and Time
				    </Typography>	
			 		<MuiPickersUtilsProvider utils={DateFnsUtils}>
				      <Grid container justify="space-around">
				        
				        <KeyboardDatePicker
				          margin="normal"
				          id="date-picker-dialog"
				          label="Date picker dialog"
				          format="MM/dd/yyyy"
				          value={selectedStartDate}
				          onChange={handleStartDateChange}
				          KeyboardButtonProps={{
				            'aria-label': 'change date',
				          }}
				        />
				        <KeyboardTimePicker
				          margin="normal"
				          id="time-picker"
				          label="Time picker"
				          value={selectedStartDate}
				          onChange={handleStartDateChange}
				          KeyboardButtonProps={{
				            'aria-label': 'change time',
				          }}
				        />
				      </Grid>
				    </MuiPickersUtilsProvider>
			 	</Card>
			 	<Card className={classes.card} xs={6}>
			 		<Typography variant="h6" gutterBottom>
				        Select End Date and Time
				    </Typography>	
			 		<MuiPickersUtilsProvider utils={DateFnsUtils}>
				      <Grid container justify="space-around">
				        
				        <KeyboardDatePicker
				          margin="normal"
				          id="date-picker-dialog"
				          label="Date picker dialog"
				          format="MM/dd/yyyy"
				          value={selectedEndDate}
				          onChange={handleEndDateChange}
				          KeyboardButtonProps={{
				            'aria-label': 'change date',
				          }}
				        />
				        <KeyboardTimePicker
				          margin="normal"
				          id="time-picker"
				          label="Time picker"
				          value={selectedEndDate}
				          onChange={handleEndDateChange}
				          KeyboardButtonProps={{
				            'aria-label': 'change time',
				          }}
				        />
				      </Grid>
				    </MuiPickersUtilsProvider>
			 	</Card>
			 	<Button variant="outlined" onClick={paymentHandler} color="primary" style={{ textTransform: "none" }}>
                            Submit
                            </Button>
			 	{success && (
				   <Alert severity="success">{success}</Alert>
				 )}
			 </Grid>
		)

}

export default Booking