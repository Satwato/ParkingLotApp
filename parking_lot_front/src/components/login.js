import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { Paper, Grid, TextField, Button, Card, CircularProgress } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
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
const Login = (props) => {
  const classes = useStyles();
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        () => {
          props.history.push("/profile");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };
  
  return (
    <React.Fragment>
      
      <Grid  container justify="center" alignItems="center">
        <Card className={classes.card}>
            
            
                <Grid item className={classes.inCard} md={12}>
                    
            
                    <Form onSubmit={handleLogin}  ref={form}>
                      
                      <Grid className={classes.form}>
                          
                          <TextField
                            label='Username'
                            value={username}
                            onChange={onChangeUsername}
                            variant='outlined'
                            helperText={required}
                            required
                          />
                      </Grid>
                    
            
                      <Grid className={classes.form}>
                                        
                          <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={onChangePassword}
                            variant='outlined'
                            required
                          />
                        
                      </Grid>
            
                      <Grid container justify="center" style={{ marginTop: '10px' }}>
                            <Button variant="outlined"  type="submit" color="primary" style={{ textTransform: "none" }}>
                            {loading && (
                              <CircularProgress />
                            )}
                            <span>Login</span>
                            </Button>
                      </Grid>
                      {message && (
                      <Alert severity="error">{message}</Alert>
                      )}
                      <CheckButton style={{ display: "none" }} ref={checkBtn} />
                    </Form>
                  
                </Grid>
                </Card>    
      </Grid>
      
    </React.Fragment>
  );
};

export default Login;
