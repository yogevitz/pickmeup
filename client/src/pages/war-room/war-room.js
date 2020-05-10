import React from 'react';
import AttendanceList from '../../components/AttendanceList';
import { Table } from "../../components/Table";
import BSButton from 'react-bootstrap/Button';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import ProgressBar from 'react-bootstrap/ProgressBar';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import {
  getLiftSupervisor,
  getLiftRiders,
  setLiftRiderMark,
  setLiftRiderApproved,
  getAllShuttles
} from "../../proxy";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";

const liftsColumns = [
  { title: 'Name', field: 'shuttleName' },
  { title: 'Supervisor Name', field: 'supervisorName' },
  { title: 'Supervisor Phone', field: 'supervisorPhone' },
  {
    title: 'Attendance',
    render: rowData => {
      return rowData.numOfRiders === 0 ? '' : (
      <ProgressBar>
        <ProgressBar
          animated
          variant="success"
          label={`${rowData.numOfPresentRiders}`}
          now={100 * rowData.numOfPresentRiders / rowData.numOfRiders}
          key={1}
        />
        <ProgressBar
          animated
          variant="info"
          label={`${rowData.numOfApprovedRiders}`}
          now={100 * rowData.numOfApprovedRiders / rowData.numOfRiders}
          key={2}
        />
        <ProgressBar
          animated
          variant="warning"
          label={`${rowData.numOfMovedRiders}`}
          now={100 * rowData.numOfMovedRiders / rowData.numOfRiders}
          key={3}
        />
        <ProgressBar
          animated
          variant="danger"
          label={`${rowData.numOfMissingRiders}`}
          now={100 * rowData.numOfMissingRiders / rowData.numOfRiders}
          key={4}
        />
      </ProgressBar>
      )}
  },
];

const columns = [
  { title: 'Name', field: 'riderName' },
  { title: 'ID', field: 'riderID' },
  { title: 'Parent Name', field: 'parentName' },
  { title: 'Parent Phone', field: 'parentPhone' },
];

const marks = [
  { id: '0', label: 'Missing' },
  { id: '1', label: 'Present' },
  { id: '2', label: 'Approved' },
  { id: '3', label: 'Moved' },
];

class WarRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lifts: [],
      isSetRiderMarkDialogOpen: false,
    };
    this.shuttles = [];
    this.checked = {};
    this.selectedDate = new Date().toJSON();
    this.riderMarkDialogData = {};
  }

  onClickMark = rowProps => {
    this.riderMarkDialogData = rowProps.data;
    this.setState({ isSetRiderMarkDialogOpen: true });
  };

  onSetMark = async mark => {
    this.setState({ isSetRiderMarkDialogOpen: false });
    const shuttleID = this.riderMarkDialogData.shuttleID;
    const riderID = this.riderMarkDialogData.riderID;

    await setLiftRiderMark({
      shuttleID,
      riderID,
      date: this.formatDate(this.selectedDate),
      mark,
      direction: 'Afternoon',
    });

    this.riderMarkDialogData = {};
    await this.update();
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

    const lifts = await Promise.all(
      this.shuttles.map(async shuttle => {
      const shuttleID = shuttle.shuttleID;
      const shuttleName = shuttle.name;
      const liftSupervisor = await getLiftSupervisor({
        shuttleID,
        date: formattedDate,
        direction: 'Afternoon'
      });
      const supervisor = liftSupervisor.length
        ? liftSupervisor[0]
        : {};
      const supervisorID = supervisor.supervisorID || '315662485';
      const supervisorName = supervisor.supervisorName || 'Idan Shani';
      const supervisorPhone = supervisor.supervisorPhone || '0549725564';
      const liftRiders = await getLiftRiders({
        shuttleID,
        date: formattedDate,
        direction: 'Afternoon',
      });
      const riders = liftRiders.map(this.getRiderRowData);
      const numOfMissingRiders = riders.filter(rider => rider.mark === '0').length;
      const numOfPresentRiders = riders.filter(rider => rider.mark === '1').length;
      const numOfApprovedRiders = riders.filter(rider => rider.mark === '2').length;
      const numOfMovedRiders = riders.filter(rider => rider.mark === '3').length;
      const numOfRiders = riders.length;
      return ({
        shuttleID,
        shuttleName,
        supervisorID,
        supervisorName,
        supervisorPhone,
        riders,
        numOfPresentRiders,
        numOfMissingRiders,
        numOfApprovedRiders,
        numOfMovedRiders,
        numOfRiders,
      })
    }));

    this.setState({ lifts });
  };

  updateShuttles = async () => {
    this.checked = {};
    this.shuttles = await getAllShuttles();
    this.shuttles
      .sort((a, b) => (a.name > b.name) ? 1 : -1)
      .forEach(shuttle => {this.checked[shuttle.shuttleID] = []});
  };

  async componentDidMount() {
    await this.updateShuttles();
    await this.update();
  }

  setMarkAction = rowProps => {
    switch (rowProps.data.mark) {
      case "0":
        return (
          <BSButton
            block={true}
            variant="danger"
            size="sm"
            onClick={() => this.onClickMark(rowProps)}
          >
            Missing
          </BSButton>
        );
      case "1":
        return (
          <BSButton
            block={true}
            variant="success"
            size="sm"
            onClick={() => this.onClickMark(rowProps)}
          >
            Present
          </BSButton>
        );
      case "2":
        return (
          <BSButton
            block={true}
            variant="info"
            size="sm"
            onClick={() => this.onClickMark(rowProps)}
          >
            Approved
          </BSButton>
        );
      case "3":
        return (
          <BSButton
            block={true}
            variant="warning"
            size="sm"
            onClick={() => this.onClickMark(rowProps)}
          >
            Moved
          </BSButton>
        );
    }
  };

  getTitle = () =>
    `${moment(this.selectedDate).format('dddd')}, ${moment(this.selectedDate).format('ll')}`;

  renderDetailPanel = rowData => {
    const { lifts } = this.state;
    const shuttleID = rowData.shuttleID;
    const shuttleName = rowData.shuttleName;
    const liftRiders = lifts.find(lift => lift.shuttleID === shuttleID).riders;
    return (
      <div style={{ backgroundColor: 'WhiteSmoke', padding: '30px 50px 30px 50px' }}>
        <Dialog fullWidth open={this.state.isSetRiderMarkDialogOpen} onClose={this.closeAddRiderDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{`Set ${this.riderMarkDialogData.riderName}'s Attendance for ${shuttleName}`}</DialogTitle>
          <DialogContent>
            <Autocomplete
              id="set-rider-mark"
              autoComplete={true}
              openOnFocus={true}
              options={marks}
              getOptionLabel={option => option.label}
              style={{ paddingBottom: '20px' }}
              onChange={(event, newValue) => {
                this.riderMarkDialogData.mark = newValue.id;
              }}
              renderInput={(params) => <TextField {...params} label="Mark" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ isSetRiderMarkDialogOpen: false })} color="primary">
              Cancel
            </Button>
            <Button
              onClick={async () =>
                this.onSetMark(this.riderMarkDialogData.mark)}
              color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <AttendanceList
          title={shuttleName}
          columns={columns}
          selection={true}
          data={liftRiders}
          setMarkAction={this.setMarkAction}
        />
      </div>
    );
  };

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
        <Grid style={{marginTop: '15px'}}>
          <Table
            title={this.getTitle()}
            columns={liftsColumns}
            data={lifts}
            detailPanel={this.renderDetailPanel}
            paging={false}
            addable={false}
            updateable={false}
            deleteable={false}
          />
        </Grid>
      </Grid>
    );
  }
}

export default WarRoom;
