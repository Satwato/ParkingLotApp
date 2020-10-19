import React from "react";
import AuthService from "../services/auth.service";
import { Paper, Grid, TextField, Button, Card, CircularProgress } from '@material-ui/core'

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckButton from "react-validation/build/button";
const useStyles = makeStyles({
  root:{
    textAlign: "left",
  },
  card: {
    minWidth: 275,
    margin: 20
  },
  inCard:{
    margin:30,
  },
  form:{
    padding:10
  }
 
});

const Profile = () => {
  const classes = useStyles();
  const currentUser = AuthService.getCurrentUser();
  console.log(currentUser)
  return (
    <Grid className={classes.root} container alignItems="center" direction="column" >
      
       <Typography variant="h2">
        Profile: <strong>{currentUser.username}</strong>
       </Typography>
        
       <Typography variant="h6"> 
        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
        </Typography>
    </Grid>
    
  );
};

export default Profile;
