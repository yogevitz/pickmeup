import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from "@material-ui/core/Container";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import WarRoom from "./pages/war-room";
import Shuttles from "./pages/shuttles";
import Supervisors from "./pages/supervisors";
import Riders from "./pages/riders";
import Schedule from "./pages/schedule";
import Settings from "./pages/settings";

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Container fixed>
        <Card>
          <CardHeader title={'Shuttles System'} />
          <AppBar position="static">
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="Shuttles System"
            >
              <LinkTab label="War Room" href="/" {...a11yProps(0)} />
              <LinkTab label="Shuttles" href="/shuttles" {...a11yProps(1)} />
              <LinkTab label="Supervisors" href="/supervisors" {...a11yProps(2)} />
              <LinkTab label="Riders" href="/riders" {...a11yProps(3)} />
              <LinkTab label="Schedule" href="/schedule" {...a11yProps(4)} />
              <LinkTab label="Settings" href="/settings" {...a11yProps(5)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <WarRoom/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Shuttles/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Supervisors/>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Riders/>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Schedule/>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <Settings/>
          </TabPanel>
        </Card>
      </Container>
    </div>
  );
}