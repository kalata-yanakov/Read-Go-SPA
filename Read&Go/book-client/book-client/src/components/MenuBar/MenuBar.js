import React, { useState, useContext } from 'react';
import {  makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withRouter } from 'react-router-dom';
import UserContext from '../Providers/UserContext';
import Logo from '../static/images/Logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  title: {
    flexGrow: 1,
  },
  
}));

const MenuAppBar = (props) => {
  const history = props.history;
  const classes = useStyles();
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, setUser } = useContext(UserContext);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');

    history.push('/');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position='static'
        style={{ background: '#0b0c10', width: '100vw' }}
      >
        <Toolbar>
          <img
            src={Logo}
            alt='logo'
            onClick={() => history.push('/home')}
            style={{ cursor: 'pointer' }}
          />
          <Typography variant='h6' className={classes.title}></Typography>

          <IconButton onClick={() => history.push('/books')}>
            <MenuBookRoundedIcon
              style={{ hover: 'pointer' }}
              style={{ color: '#66fcf1 ' }}
            />
          </IconButton>

          {auth && (
            <div>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle style={{ color: '#66fcf1 ' }} />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={(handleClose, () => history.push('/profile'))}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={(handleClose, logout)}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(MenuAppBar);
