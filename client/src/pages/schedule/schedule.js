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
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getAllShuttles, getAllSupervisors } from "../../proxy";

const SHIFT_KEY = 16;

const appointments = {
  '63973779589': [
    {
      title: 'רותם סלע',
      supervisor: '316248216',
      startDate: new Date(2020, 4, 31),
      endDate: new Date(2020, 5, 1),
      id: 1,
    },
    {
      title: 'רותם סלע',
      supervisor: '316248216',
      startDate: new Date(2020, 5, 1),
      endDate: new Date(2020, 5, 2),
      id: 2,
    },
    {
      title: 'שלמה ארצי',
      supervisor: '311530018',
      startDate: new Date(2020, 5, 2),
      endDate: new Date(2020, 5, 3),
      id: 3,
    },
    {
      title: 'שלמה ארצי',
      supervisor: '311530018',
      startDate: new Date(2020, 5, 3),
      endDate: new Date(2020, 5, 4),
      id: 4,
    },
    {
      title: 'שלמה ארצי',
      supervisor: '311530018',
      startDate: new Date(2020, 5, 4),
      endDate: new Date(2020, 5, 5),
      id: 5,
    },
    {
      title: 'שלמה ארצי',
      supervisor: '311530018',
      startDate: new Date(2020, 5, 5),
      endDate: new Date(2020, 5, 6),
      id: 6,
    },
    {
      title: 'נועה קירל',
      supervisor: '315662485',
      startDate: new Date(2020, 5, 7),
      endDate: new Date(2020, 5, 8),
      id: 7,
    },
    {
      title: 'נועה קירל',
      supervisor: '315662485',
      startDate: new Date(2020, 5, 8),
      endDate: new Date(2020, 5, 9),
      id: 8,
    },
    {
      title: 'נועה קירל',
      supervisor: '315662485',
      startDate: new Date(2020, 5, 9),
      endDate: new Date(2020, 5, 10),
      id: 9,
    },
    {
      title: 'אביב גפן',
      supervisor: '302548452',
      startDate: new Date(2020, 5, 10),
      endDate: new Date(2020, 5, 11),
      id: 10,
    },
    {
      title: 'אביב גפן',
      supervisor: '302548452',
      startDate: new Date(2020, 5, 11),
      endDate: new Date(2020, 5, 12),
      id: 11,
    },
    {
      title: 'בר רפאלי',
      supervisor: '208374172',
      startDate: new Date(2020, 5, 12),
      endDate: new Date(2020, 5, 13),
      id: 12,
    },
    {
      title: 'בר רפאלי',
      supervisor: '208374172',
      startDate: new Date(2020, 5, 14),
      endDate: new Date(2020, 5, 15),
      id: 13,
    },
    {
      title: 'בר רפאלי',
      supervisor: '208374172',
      startDate: new Date(2020, 5, 15),
      endDate: new Date(2020, 5, 16),
      id: 14,
    },
    {
      title: 'רועי כפרי',
      supervisor: '314229873',
      startDate: new Date(2020, 5, 16),
      endDate: new Date(2020, 5, 17),
      id: 15,
    },
    {
      title: 'רועי כפרי',
      supervisor: '314229873',
      startDate: new Date(2020, 5, 17),
      endDate: new Date(2020, 5, 18),
      id: 16,
    },
  ],
  '69379352912': [
    {
      title: 'טל טירנגל',
      supervisor: '309887272',
      startDate: new Date(2020, 4, 31),
      endDate: new Date(2020, 5, 1),
      id: 1,
    },
    {
      title: 'טל טירנגל',
      supervisor: '309887272',
      startDate: new Date(2020, 5, 1),
      endDate: new Date(2020, 5, 2),
      id: 2,
    },
    {
      title: 'רותם סלע',
      supervisor: '316248216',
      startDate: new Date(2020, 5, 2),
      endDate: new Date(2020, 5, 3),
      id: 3,
    },
    {
      title: 'רותם סלע',
      supervisor: '316248216',
      startDate: new Date(2020, 5, 3),
      endDate: new Date(2020, 5, 4),
      id: 4,
    },
    {
      title: 'שלמה ארצי',
      supervisor: '311530018',
      startDate: new Date(2020, 5, 4),
      endDate: new Date(2020, 5, 5),
      id: 5,
    },
    {
      title: 'שלמה ארצי',
      supervisor: '311530018',
      startDate: new Date(2020, 5, 5),
      endDate: new Date(2020, 5, 6),
      id: 6,
    },
    {
      title: 'נועה קירל',
      supervisor: '315662485',
      startDate: new Date(2020, 5, 7),
      endDate: new Date(2020, 5, 8),
      id: 7,
    },
    {
      title: 'נועה קירל',
      supervisor: '315662485',
      startDate: new Date(2020, 5, 8),
      endDate: new Date(2020, 5, 9),
      id: 8,
    },
    {
      title: 'רותם סלע',
      supervisor: '316248216',
      startDate: new Date(2020, 5, 9),
      endDate: new Date(2020, 5, 10),
      id: 9,
    },
    {
      title: 'רותם סלע',
      supervisor: '316248216',
      startDate: new Date(2020, 5, 10),
      endDate: new Date(2020, 5, 11),
      id: 10,
    },
    {
      title: 'רותם סלע',
      supervisor: '316248216',
      startDate: new Date(2020, 5, 11),
      endDate: new Date(2020, 5, 12),
      id: 11,
    },
    {
      title: 'בר רפאלי',
      supervisor: '208374172',
      startDate: new Date(2020, 5, 12),
      endDate: new Date(2020, 5, 13),
      id: 12,
    },
    {
      title: 'בר רפאלי',
      supervisor: '208374172',
      startDate: new Date(2020, 5, 14),
      endDate: new Date(2020, 5, 15),
      id: 13,
    },
    {
      title: 'בר רפאלי',
      supervisor: '208374172',
      startDate: new Date(2020, 5, 15),
      endDate: new Date(2020, 5, 16),
      id: 14,
    },
    {
      title: 'רועי כפרי',
      supervisor: '314229873',
      startDate: new Date(2020, 5, 16),
      endDate: new Date(2020, 5, 17),
      id: 15,
    },
    {
      title: 'רועי כפרי',
      supervisor: '314229873',
      startDate: new Date(2020, 5, 17),
      endDate: new Date(2020, 5, 18),
      id: 16,
    },
    {
      title: 'רועי כפרי',
      supervisor: '314229873',
      startDate: new Date(2020, 5, 18),
      endDate: new Date(2020, 5, 19),
      id: 17,
    },
  ],
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onSupervisorChange = (event, newValue) => {
    console.log('onSupervisorChange');
    console.log({event, newValue});
    onFieldChange({
      supervisor: newValue ? newValue.id : null,
      title: newValue ? newValue.text : null,
    });
  };

  return (
    <Grid container justify="center" spacing={3} style={{ marginTop: '5px', textAlign: 'center' }}>
      <Grid item xs={5}>
        <Autocomplete
          id="supervisor-select"
          options={restProps.resources[0].instances}
          getOptionLabel={option => option.text}
          onChange={onSupervisorChange}
          value={restProps.appointmentResources ? restProps.appointmentResources[0] : null}
          renderInput={(params) =>
            <TextField {...params} label="Supervisor" variant="outlined" />}
        />
      </Grid>
    </Grid>
  );
};

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttles: [],
      supervisors: [],
      selectedShuttle: null,
      selectedDate: new Date(),
      selectedSupervisor: null,
      data: [],
      resources: [],
      isShiftPressed: false,
    };
  }

  commitChanges = ({ added, changed, deleted }) => {
    this.setState((state) => {
      let { data } = state;
      console.log(data);
      const { isShiftPressed } = this.state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        if (isShiftPressed) {
          const changedAppointment = data.find(appointment => changed[appointment.id]);
          const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
          data = [
            ...data,
            { ...changedAppointment, id: startingAddedId, ...changed[changedAppointment.id] },
          ];
        } else {
          data = data.map(appointment => (
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment));
        }
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  };

  mapSupervisors = supervisor => ({
    ...supervisor,
    id: supervisor.supervisorID,
    text: supervisor.name,
    color: this.getRandomColor(),
  });

  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  async componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    const shuttles = await getAllShuttles();
    const supervisorsData = await getAllSupervisors();
    const supervisors = supervisorsData.map(this.mapSupervisors);
    const resources = [{
      title: "Supervisor",
      fieldName: "supervisor",
      instances: supervisors,
      allowMultiple: false
    }];
    this.setState({ shuttles, supervisors, resources });
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', null);
    window.removeEventListener('keyup', null);
  }

  onKeyDown = event => {
    if (event.keyCode === SHIFT_KEY) {
      this.setState({ isShiftPressed: true });
    }
  };

  onKeyUp = event => {
    if (event.keyCode === SHIFT_KEY) {
      this.setState({ isShiftPressed: false });
    }
  };

  onChangeSelectedShuttle = (event, newValue) => {
    this.setState({
      selectedShuttle: newValue,
      data: newValue && newValue['shuttleID']
        ? appointments[newValue['shuttleID']]
        : [],
    });
  };

  render() {
    const { shuttles, selectedShuttle } = this.state;
    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container justify="center" spacing={3} style={{ marginTop: '5px', textAlign: 'center' }}>
            <Grid item xs={5}>
              <Autocomplete
                id="shuttle-select"
                options={shuttles}
                getOptionLabel={(option) => option.name}
                onChange={this.onChangeSelectedShuttle}
                renderInput={(params) =>
                  <TextField {...params} label="הסעה" variant="outlined" />}
              />
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={3} style={{ marginTop: '15px', textAlign: 'center' }}>
            {selectedShuttle && <Grid item xs={10}>
              <Paper>
                <Scheduler data={this.state.data || []} >
                  <ViewState />
                  <EditingState onCommitChanges={this.commitChanges} />
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
                  <AppointmentForm
                    basicLayoutComponent={BasicLayout}
                  />
                  <Resources data={this.state.resources} mainResourceName="supervisor" />
                  <DragDropProvider allowResize={() => false}/>
                </Scheduler>
              </Paper>
            </Grid>}
          </Grid>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default Schedule;