import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
}));

class Supervisors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const classes = useStyles();
    return (
      <div>
        Supervisors
      </div>
    );
  }
}

export default Supervisors;
