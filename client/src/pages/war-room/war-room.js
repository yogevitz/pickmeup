import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getAllShuttles } from "../../proxy";

class WarRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttles: [],
    };
  }

  async componentWillMount() {
    const shuttles = await getAllShuttles();
    this.setState({ shuttles: shuttles });
  }

  render() {
    const { shuttles } = this.state;
    return (
      <div>
        <Autocomplete
          id="shuttle-select"
          options={shuttles}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) =>
            <TextField {...params} label="Shuttle" variant="outlined" />}
        />
      </div>
    );
  }
}

export default WarRoom;
