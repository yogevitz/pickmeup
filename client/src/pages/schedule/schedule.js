import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { getAllShuttles, getAllSupervisors } from "../../proxy";

const directions = [ 'Morning', 'Afternoon' ];

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttles: [],
      supervisors: [],
      selectedShuttle: undefined,
      selectedDate: undefined,
      selectedDirection: undefined,
      selectedSupervisor: undefined,
    };
  }

  handlePickSupervisor = event => {
    this.setState({ supervisor: event.target.value })
  };

  async componentDidMount() {
    const shuttles = await getAllShuttles();
    const supervisors = await getAllSupervisors();
    this.setState({ shuttles: shuttles, supervisors: supervisors });
  }

  render() {
    const { shuttles, supervisors, selectedShuttle, selectedDate, selectedDirection, selectedSupervisor } = this.state;
    const showAssignPanel = !!selectedShuttle && !!selectedDate && !!selectedDirection;
    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="center" spacing={3} style={{ marginTop: '6px', textAlign: 'center' }}>
            <Grid item xs={3}>
              <Autocomplete
                id="shuttle-select"
                options={shuttles}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  this.setState({ selectedShuttle: newValue});
                }}
                renderInput={(params) =>
                  <TextField {...params} label="Shuttle" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={3}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Date picker dialog"
                format="MM/dd/yyyy"
                value={selectedDate}
                onChange={(event, newValue) => {
                  this.setState({ selectedDate: newValue});
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                id="direction-select"
                options={directions}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => {
                  this.setState({ selectedDirection: newValue});
                }}
                renderInput={(params) =>
                  <TextField {...params} label="Direction" variant="outlined" />}
              />
            </Grid>
          </Grid>
          <Divider style={{ marginTop: '18px' }} />
          <Grid container justify="center" spacing={3} style={{ marginTop: '6px', textAlign: 'center' }}>
            <Grid item>
              {showAssignPanel ?
                (<div>
                  <Grid item xs={12}>
                    Choose supervisor:
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="gender" name="gender1" value={selectedSupervisor} onChange={this.handleChange}>
                        {
                          supervisors.map(value => (<FormControlLabel value={value.name} control={<Radio />} label={value.name} />))
                        }
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" style={{marginTop: '12px'}}>
                      Save
                    </Button>
                  </Grid>
                </div>)
                :
                (<div>
                  Please choose shuttle, date and direction
                </div>)}
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default Schedule;