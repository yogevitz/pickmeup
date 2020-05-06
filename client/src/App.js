import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from "@material-ui/core/Container";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import WarRoom from "./pages/war-room";
import Shuttles from "./pages/shuttles";
import Supervisors from "./pages/supervisors";
import Riders from "./pages/riders";
import Login from "./pages/login";
import Schedule from "./pages/schedule";
import Settings from "./pages/settings";
import { login } from './proxy';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NavTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [isConnected, setIsConnected] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onLogin = async () => {
    const data = await login();
    if (data && data.type && data.type === 'Admin') {
      setIsConnected({isConnected: true});
    }
  };

  const showCreditFooter = false;
  const linkTabStyle = { color: 'inherit', textDecoration: 'none' };

  return (
    <div className={classes.root}>
      <Container fixed style={{ paddingBottom: "15px" }}>
        <Card style={{ marginBottom: "15px", minHeight: "1200px", backgroundColor: "OldLace", height: '100%' }}>
          {!isConnected
            ? (
              <Button onClick={onLogin}>
                Log in
              </Button>)
            : (
              <div>
                <CardHeader title={'Shuttles System'} />
                <AppBar position="static">
                  <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="Shuttles System"
                  >
                    <LinkTab label="War Room" href="/" {...a11yProps(0)} style={linkTabStyle} />
                    <LinkTab label="Shuttles" href="/shuttles" {...a11yProps(1)} style={linkTabStyle} />
                    <LinkTab label="Riders" href="/riders" {...a11yProps(2)} style={linkTabStyle} />
                    <LinkTab label="Supervisors" href="/supervisors" {...a11yProps(3)} style={linkTabStyle} />
                    <LinkTab label="Schedule" href="/schedule" {...a11yProps(4)} style={linkTabStyle} />
                    <LinkTab label="Settings" href="/settings" {...a11yProps(5)} style={linkTabStyle} />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                  <WarRoom/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Shuttles/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Riders/>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <Supervisors/>
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <Schedule/>
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <Settings/>
                </TabPanel>
              </div>
            )}
        </Card>
        {showCreditFooter && <div style={{ fontSize: "11px", textAlign: "center" }}>
          Powered by PickMeUp.com
        </div>}
      </Container>
    </div>
  );
}