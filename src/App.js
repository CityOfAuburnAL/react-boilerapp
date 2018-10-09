import React from 'react';
import classNames from 'classnames';
import { Router, Switch as SwitchRoute, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import { history } from './redux/helpers/';
import { alertActions } from './redux/actions/';
import { Login, PrivateRoute } from './components';
import Can from './components/Can';

import { NotFoundPage, HomePage, InformationTechnologyPage } from './pages';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Hidden from '@material-ui/core/Hidden';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  grow: {
    flexGrow: 1,
  },
  navIconHideSm: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  navIconHideLg: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    transitionDuration: '0ms !important',
  },
  drawerDocked: {
    height: '100%',
  },
  toolbar: theme.mixins.toolbar,
  list: {
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  contentShift: {
    [theme.breakpoints.up('md')]: {
      marginLeft: -drawerWidth,
    },
  },
});

class App extends React.Component {
  state = {
    accountIcon: null,
    drawer: false,
    persistDrawer: true,
    currentPath: history.location.pathname,
  }

  constructor(props) {
    super(props);
    
    const { dispatch } = this.props;
    history.listen((location, action) => {
        // clear alert on location change
        dispatch(alertActions.clear());
        this.handleDrawerClose();
        this.setState({ currentPath: location.pathname });
    });
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ drawer: !state.drawer }));
  };

  handleDrawerClose = () => {
    if (this.state.drawer) this.handleDrawerToggle();
  };

  handlePersistDrawerToggle = () => {
    this.setState(state => ({ persistDrawer: !state.persistDrawer }));
  };
  
  handleAccountMenuOpen = (event) => {
    this.setState({ accountIcon: event.currentTarget });
  };

  handleAccountMenuClose = () => {
    this.setState({ accountIcon: null });
  };

  handleLogout = () => {
    history.push(`${process.env.PUBLIC_URL}/login`);
    this.handleAccountMenuClose();
  };

  handleListItemClick = (event, index, route) => {
    history.push(`${route}`);
  };

  render() {
    const { authentication, classes } = this.props;
    const { accountIcon, drawer, persistDrawer, currentPath } = this.state;
    const open = Boolean(accountIcon);

    const drawerContents = (
      <List component="nav">
        <ListItem
          button
          selected={currentPath === `${process.env.PUBLIC_URL}/`}
          onClick={event => this.handleListItemClick(event, 0, '/')}
        >
          Home
        </ListItem>
        <ListItem
          button
          selected={currentPath === `${process.env.PUBLIC_URL}/it`}
          onClick={event => this.handleListItemClick(event, 1, '/it')}
        >
          Information Technology
        </ListItem>
        <Can I="manage" a="Information Technology">
          <ListItem>
            Manage IT
          </ListItem> 
        </Can>
      </List>
    )

    return (
      <div className="App">
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <IconButton onClick={this.handleDrawerToggle} className={classNames(classes.menuButton, classes.navIconHideLg)} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <IconButton onClick={this.handlePersistDrawerToggle} className={classNames(classes.menuButton, classes.navIconHideSm)} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              City of Auburn
            </Typography>
            {authentication.loggedIn && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleAccountMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={accountIcon}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleAccountMenuClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <SwipeableDrawer
            open={drawer}
            onClose={this.handleDrawerToggle}
            onOpen={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <div className={classes.list}>
              {drawerContents}
            </div>
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="persistent"
            anchor="left"
            open={persistDrawer}
            classes={{
              paper: classes.drawerPaper,
              docked: classes.drawerDocked,
            }}
          >
            <div className={classes.list}>
              <div className={classes.toolbar} />
              {drawerContents}
            </div>
          </Drawer>
        </Hidden>
        <main className={classNames(classes.content, !persistDrawer && classes.contentShift)}>
          <div className={classes.toolbar} />
          <Router history={history} basename={'/'}>
            <SwitchRoute>
              <PrivateRoute exact path={`${process.env.PUBLIC_URL}/`} component={HomePage}></PrivateRoute>
              <PrivateRoute path={`${process.env.PUBLIC_URL}/it`} component={InformationTechnologyPage}></PrivateRoute>
              <Route path={`${process.env.PUBLIC_URL}/login`} component={Login}></Route>
              <Route component={NotFoundPage}/>
            </SwitchRoute>
          </Router>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, alert } = state;
  return {
      authentication,
      alert
  };
}

const connectedApp = withStyles(styles)(connect(mapStateToProps)(App));
export { connectedApp as App }; 