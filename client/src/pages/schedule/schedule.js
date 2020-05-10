import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  AppointmentTooltip,
  AppointmentForm,
  EditRecurrenceMenu,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getAllShuttles, getAllSupervisors } from "../../proxy";

const appointments = [
  {
    title: 'Yogev Shlomovitz',
    supervisor: 0,
    startDate: new Date(2020, 4, 3),
    endDate: new Date(2020, 4, 7),
    id: 0,
  },
  {
    title: 'Idan Shani',
    supervisor: 1,
    startDate: new Date(2020, 4, 7),
    endDate: new Date(2020, 4, 12),
    id: 1,
  },
  {
    title: 'Hadar Nataf',
    supervisor: 2,
    startDate: new Date(2020, 4, 12),
    endDate: new Date(2020, 4, 21),
    id: 2,
  },
  {
    title: 'Tomer Gabay',
    supervisor: 3,
    startDate: new Date(2020, 4, 21),
    endDate: new Date(2020, 4, 31),
    id: 3,
  },
];

const supervisors = [
  {
    text: 'Yogev Shlomovitz',
    id: 0,
    color: '#7E57C2',
  }, {
    text: 'Idan Shani',
    id: 1,
    color: '#FF7043',
  }, {
    text: 'Hadar Nataf',
    id: 2,
    color: '#54c239',
  }, {
    text: 'Tomer Gabay',
    id: 3,
    color: '#6397ff',
  }
];

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttles: [],
      supervisors: [],
      selectedShuttle: undefined,
      selectedDate: new Date(),
      selectedSupervisor: undefined,
      data: appointments,
      resources: [
        {
          fieldName: "supervisor",
          title: "Supervisor",
          instances: supervisors,
          allowMultiple: false
        }
      ]
    };
  }

  commitChanges = ({ added, changed, deleted }) => {
    this.setState(state => {
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  };

  async componentDidMount() {
    const shuttles = await getAllShuttles();
    const supervisors = await getAllSupervisors();
    this.setState({ shuttles, supervisors });
  }

  render() {
    const { shuttles } = this.state;
    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container justify="center" spacing={3} style={{ marginTop: '5px', textAlign: 'center' }}>
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
          </Grid>
          <Grid container justify="center" spacing={3} style={{ marginTop: '15px', textAlign: 'center' }}>
            <Grid item xs={10}>
              <Paper>
                <Scheduler data={this.state.data} >
                  <ViewState />
                  <EditingState onCommitChanges={this.commitChanges} />
                  <EditRecurrenceMenu />
                  <IntegratedEditing />
                  <MonthView />
                  <Toolbar />
                  <DateNavigator />
                  <TodayButton />
                  <Appointments />
                  <AppointmentTooltip
                    showCloseButton
                    showOpenButton
                    showDeleteButton
                  />
                  <AppointmentForm />
                  <Resources data={this.state.resources} mainResourceName="supervisor" />
                  <DragDropProvider allowResize={() => false}/>
                </Scheduler>
              </Paper>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default Schedule;