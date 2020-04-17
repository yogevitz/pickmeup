import React from 'react';
import AttendanceList from '../../components/AttendanceList';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { getLiftRiders, setLiftRiderMark, setLiftRiderApproved, getAllShuttles } from "../../proxy";

const columns = [
  { title: 'Name', field: 'riderName' },
  { title: 'ID', field: 'riderID' },
  { title: 'Parent Name', field: 'parentName' },
  { title: 'Parent Phone', field: 'parentPhone' },
];

class WarRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liftRiders: [],
      lifts: [],
    };
    this.shuttles = [];
    this.checked = {};
    this.selectedDate = new Date();
  }

  onSelectionChange = async (selected, selectedRow) => {
    const shuttleID = selected.length
      ? selected[0].shuttleID
      : selectedRow.shuttleID;
    const selectedIDs = selected.map(_ => _.riderID);

    let newChecked, newUnChecked;
    let newLifts = this.state.lifts;

    if (this.checked[shuttleID] && selectedIDs.length > this.checked[shuttleID].length) {
      newChecked = selectedIDs.filter(x => this.checked[shuttleID].indexOf(x) < 0);
      this.checked[shuttleID].push(...newChecked);
      newChecked.forEach(async checked => {
        await setLiftRiderMark({
          shuttleID,
          riderID: checked,
          date: this.formatDate(this.selectedDate),
          direction: 'Afternoon',
          mark: '1',
        });

        const tmpLiftRider = newLifts.find(lift => lift.shuttleID === shuttleID)
          .riders.find(_ => _.riderID === checked);
        tmpLiftRider.mark = '1';
        tmpLiftRider.approved = '0';
        tmpLiftRider.tableData.checked = true;
      });
    } else if (this.checked[shuttleID]) {
      newUnChecked = this.checked[shuttleID].filter(x => selectedIDs.indexOf(x) < 0);
      this.checked[shuttleID] = this.checked[shuttleID].filter(_ => newUnChecked.indexOf(_) < 0);
      newUnChecked.forEach(async unChecked => {
        await setLiftRiderMark({
          shuttleID,
          riderID: unChecked,
          date: this.formatDate(this.selectedDate),
          direction: 'Afternoon',
          mark: '0',
        });

        const tmpLiftRider = newLifts.find(lift => lift.shuttleID === shuttleID)
          .riders.find(_ => _.riderID === unChecked);
        tmpLiftRider.mark = '0';
        tmpLiftRider.tableData.checked = false;
      });
    }

    this.setState({ lifts: newLifts });
  };

  onApproveChange = async (event, rowProps) => {
    const shuttleID = rowProps.data.shuttleID;
    const riderID = rowProps.data.riderID;
    const isApproved = event.target.checked;

    let newLifts = this.state.lifts;
    const tmpLiftRider = newLifts.find(lift => lift.shuttleID === shuttleID)
      .riders.find(_ => _.riderID === riderID);
    tmpLiftRider.approved = isApproved ? '1' : '0';

    await setLiftRiderApproved({
      shuttleID,
      riderID,
      date: this.formatDate(this.selectedDate),
      direction: 'Afternoon',
      approved: isApproved ? '1' : '0',
    });

    this.setState({ lifts: newLifts });
  };

  onSelectedDateChange = async (event, newValue) => {
    this.selectedDate = newValue;
    await this.updateShuttles();
    await this.update();
  };

  getRiderRowData = rider => {
    const checked = rider.mark === '1';
    const approved = rider.approved;
    checked && this.checked[rider.shuttleID].push(rider.riderID);
    return ({ ...rider, approved, tableData: { checked } });
  };

  formatDate = date => moment(date).format('DD[-]MM[-]YYYY');

  update = async () => {
    const formattedDate = this.formatDate(this.selectedDate);

    const lifts = await Promise.all(this.shuttles.map(async shuttle => {
      const shuttleID = shuttle.shuttleID;
      const shuttleName = shuttle.name;
      const riders = await getLiftRiders({ shuttleID, date: formattedDate, direction: 'Afternoon' });
      return ({
        shuttleID,
        shuttleName,
        riders: riders.map(this.getRiderRowData),
      })
    }));

    this.setState({ lifts });
  };

  updateShuttles = async () => {
    this.checked = {};
    this.shuttles = await getAllShuttles();
    this.shuttles.forEach(shuttle => {this.checked[shuttle.shuttleID] = []});
  };

  async componentDidMount() {
    await this.updateShuttles();
    await this.update();
  }

  render() {
    const { lifts } = this.state;
    const showRefreshButton = false;
    return (
      <Grid>
        <Grid container>
          <Grid container justify="center" spacing={3} style={{ textAlign: 'center' }}>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date"
                  autoOk
                  rifmFormatter={val=> val.replace(/[^\.\ \,\[a-zA-Z0-9_]*$]+/gi, '')}
                  refuse={/[^\.\ \,\[a-zA-Z0-9_]*$]+/gi}
                  format={"MMM DD, YYYY"}
                  variant="inline"
                  value={this.selectedDate}
                  onChange={this.onSelectedDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          {showRefreshButton && (<Button variant="contained" onClick={this.update}>
            <RefreshIcon/>
          </Button>)}
        </Grid>
        <Grid>
          {lifts.map(lift => lift.riders.length ? (
            <div key={`shuttle-${lift.shuttleName}`} style={{marginTop: '15px'}}>
              <AttendanceList
                title={lift.shuttleName}
                columns={columns}
                selection={true}
                data={lift.riders}
                onSelectionChange={this.onSelectionChange}
                onApproveChange={this.onApproveChange}
                style={{marginTop: '15px'}}
              />
            </div>
          ) : null)}
        </Grid>
      </Grid>
    );
  }
}

export default WarRoom;
