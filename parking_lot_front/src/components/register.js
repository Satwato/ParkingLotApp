import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import { Paper, Grid, TextField, Button, Card, CircularProgress } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";
import { Email } from "@material-ui/icons";

const useStyles = makeStyles({
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

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  
  if ((value.length>0) &&(!isEmail(value)) ) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername= (value) => {
  if ((value.length>0) && (value.length < 3 || value.length > 20)) {
    return true;
  }
  else{
    return false;
  }
};

const vpassword = (value) => {
  if ((value.length>0) &&(value.length < 6 || value.length > 40)) {
    return true;
  }
  else{
    return false;
  }
};

const Register = (props) => {
  const classes = useStyles();
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
   setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
   setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <Grid  container justify="center" alignItems="center">
      <Card className={classes.card}>
        
        
       <Grid item className={classes.inCard} md={12}>
       
        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
               <Grid className={classes.form}>
                          
                  <TextField
                    label='Username'
                    value={username}
                    onChange={onChangeUsername}
                    variant='outlined'
                    error={vusername(username)}
                    helperText={vusername(username)? "Must be less than 20 characters and more than 2":"" }
                    required
                  />
              </Grid>

              <Grid className={classes.form}>
                          
                  <TextField
                    label='Email'
                    value={email}
                    onChange={onChangeEmail}
                    error={validEmail(email)}
                    helperText={validEmail(email)? "Must be a valid email":"" }
                    variant='outlined'
                    required
                  />
              </Grid>
              <Grid className={classes.form}>
                          
                  <TextField
                    label='Password'
                    type="password"
                    value={password}
                    onChange={onChangePassword}
                    variant='outlined'
                    required
                  />
              </Grid>

              <Grid container justify="center" style={{ marginTop: '10px' }}>
                            <Button variant="outlined" type="submit" color="primary" style={{ textTransform: "none" }}>
                            Sign Up
                            </Button>
               </Grid>
            </div>
          )}

          {message && (
            <Alert severity="error">{message}</Alert>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        </Grid>
      </Card>
    </Grid>
  );
};

export default Register;
