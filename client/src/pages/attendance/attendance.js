import React from 'react';
import AttendanceList from '../../components/AttendanceList';
import { withTranslation } from "react-i18next";
import Table from "../../components/Table";
import BSButton from 'react-bootstrap/Button';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
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
  getAllShuttles
} from "../../proxy";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";

const marks = [
  { id: '0', label: 'חסר' },
  { id: '1', label: 'נוכח' },
  { id: '2', label: 'מאושר' },
  { id: '3', label: 'הועבר' },
  { id: '4', label: 'התווסף' },
];

class Attendance extends React.Component {
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
    checked && this.checked[rider.shuttleID].push(rider.riderID);
    return ({ ...rider, tableData: { checked } });
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
      });
      const supervisor = liftSupervisor.length
        ? liftSupervisor[0]
        : {};
      const supervisorID = supervisor.supervisorID;
      const supervisorName = supervisor.supervisorName;
      const supervisorPhone = supervisor.supervisorPhone;
      const liftRiders = await getLiftRiders({
        shuttleID,
        date: formattedDate,
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
            חסר
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
            נוכח
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
            מאושר
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
            הועבר
          </BSButton>
        );
      case "4":
        return (
          <BSButton
            block={true}
            variant="warning"
            size="sm"
            onClick={() => this.onClickMark(rowProps)}
          >
            התווסף
          </BSButton>
        );
    }
  };

  getTitle = () =>
    `${moment(this.selectedDate).format('dddd')}, ${moment(this.selectedDate).format('ll')}`;

  sortRidersByMark = (a, b) => {
    if (a.mark === "1") {
      return 1;
    } else if (b.mark === "1") {
      return -1;
    }
    return parseInt(a.mark) > parseInt(b.mark) ? 1 : -1;
  };

  renderDetailPanel = rowData => {
    const { lifts } = this.state;
    const { t } = this.props;
    const columns = [
      {
        title: t('attendance.shuttle.table.rider-name'), field: 'riderName',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('attendance.shuttle.table.rider-id'), field: 'riderID',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('attendance.shuttle.table.parent-name'), field: 'parentName',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('attendance.shuttle.table.parent-phone'), field: 'parentPhone',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
    ];
    const shuttleID = rowData.shuttleID;
    const shuttleName = rowData.shuttleName;
    const liftRiders = lifts
      .find(lift => lift.shuttleID === shuttleID).riders
      .sort(this.sortRidersByMark);
    return (
      <div style={{ backgroundColor: 'WhiteSmoke', padding: '30px 50px 30px 50px' }}>
        <Dialog fullWidth open={this.state.isSetRiderMarkDialogOpen} onClose={this.closeAddRiderDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            {
              `${t('attendance.shuttle.dialog.title.set-attendance-for')} ${this.riderMarkDialogData.riderName},
              ${t('attendance.shuttle.dialog.title.in-the-shuttle')} ${shuttleName}`
            }
          </DialogTitle>
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
              renderInput={(params) => <TextField {...params} label={t('attendance.shuttle.dialog.mark')} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ isSetRiderMarkDialogOpen: false })} color="primary">
              {t('common.cancel')}
            </Button>
            <Button
              onClick={async () =>
                this.onSetMark(this.riderMarkDialogData.mark)}
              color="primary">
              {t('common.update')}
            </Button>
          </DialogActions>
        </Dialog>
        <AttendanceList
          title={
            <Typography
              variant="h5"
              gutterBottom
              style={{ marginLeft: '20px', marginRight: '20px', }}
            >
              {shuttleName}
            </Typography>
          }
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
    const { t } = this.props;
    const showRefreshButton = false;
    const liftsColumns = [
      {
        title: t('attendance.table.name'), field: 'shuttleName',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('attendance.table.supervisor-name'), field: 'supervisorName',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('attendance.table.supervisor-phone'), field: 'supervisorPhone',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('attendance.table.attendance'),
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
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
    return (
      <Grid>
        <Grid container>
          <Grid container justify="center" spacing={3} style={{ textAlign: 'center' }}>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label={t('attendance.date.label')}
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
            title={
              <Typography
                variant="h5"
                gutterBottom
                style={{ marginLeft: '20px', marginRight: '20px', }}
              >
                {t('attendance.title')}
              </Typography>
            }
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

export default withTranslation()(Attendance);
