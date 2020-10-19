import React,  {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import AuthService from "../services/auth.service";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  }
}));
function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function ButtonAppBar() {

  const [state, setState] = React.useState({left: false});
  const classes = useStyles();
 
  const [showAdminBoard, setShowAdminBoard] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
     
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);
  const logOut = () => {
    AuthService.logout();
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      
        
       
      
      {currentUser ? (
          <List>
              <ListItemLink href="/profile" >
              <ListItemText primary={currentUser.username}/> 
              </ListItemLink>
              {showAdminBoard && (<ListItemLink href='/add-lots/_add'>
                  <ListItemText primary="Add Parking Lots" />
               </ListItemLink>) }

               <ListItemLink href="/lots" >
                <ListItemText primary="Book Parking Lot" />
              </ListItemLink>
              <ListItemLink href="/login"  onClick={logOut}>
                <ListItemText primary="LogOut"/>
              </ListItemLink>
           </List>
        ) : (
          <List>
            <ListItemLink href="/login"  >
                <ListItemText primary="Login"/>
              </ListItemLink>

             <ListItemLink href="/register"  >
                <ListItemText primary="Sign Up"/>
              </ListItemLink>
         </List>
        )}
    
    
    </div>
  );
  const anchor= "left";
  return (
    <div className={classes.root}>
      <React.Fragment key={anchor}>
      <AppBar style={{ margin: 0 }} position="static">
      
          
         
        
       
          <Toolbar>
            <IconButton  onClick={toggleDrawer(anchor, true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
              
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              ParkingLot App
            </Typography>
            
          </Toolbar>
       
      </AppBar>
      <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
          {list(anchor)}
      </Drawer>
     </React.Fragment>
    </div>
  );
}
