import React from 'react';
import Table from "../../components/Table";
import { tableIcons } from "../../utils";
import { InfoAlert, INFO_ALERT_SEVERITY, INFO_ALERT_TEXT } from "../../components/InfoAlert";
import { withTranslation } from "react-i18next";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  getAllShuttles,
  getAllRiders,
  createShuttle,
  setShuttle,
  deleteShuttle,
  getShuttleRidersByShuttle,
  createShuttleRider,
  deleteShuttleRider,
} from '../../proxy';
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class Shuttles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttles: [],
      shuttlesRiders: {},
      riders: [],
      isAddRiderDialogOpen: false,
      isInfoAlertShown: false,
    };
    this.infoAlertSeverity = '';
    this.infoAlertText = '';
  }

  async update() {
    const shuttles = await getAllShuttles();
    const riders = await getAllRiders();
    const shuttlesRiders = {};
    await shuttles
      .sort((a, b) => (a.name > b.name) ? 1 : -1)
      .forEach(async shuttle => {
        const shuttleID = shuttle.shuttleID;
        const shuttleRiders = await getShuttleRidersByShuttle(shuttleID);
        shuttlesRiders[shuttleID] = shuttleRiders.map(_ => ({
          riderID: _.riderID, riderName: _.riderName,
      }));
    });
    this.setState({ shuttles, riders, shuttlesRiders });
  }

  async componentWillMount() {
    await this.update();
  }

  handleAdd = async newData => {
    await createShuttle(newData);
    const tmpShuttles = this.state.shuttles;
    tmpShuttles.push(newData);
    this.setState({ shuttles: tmpShuttles });
    this.showInfoAlert('add');
  };

  handleUpdate = async newData => {
    await setShuttle(newData);
    let tmpShuttles = this.state.shuttles;
    tmpShuttles = tmpShuttles.filter(_ => _.shuttleID !== newData.shuttleID);
    tmpShuttles.push(newData);
    this.setState({ shuttles: tmpShuttles });
    this.showInfoAlert('update');
  };

  handleDelete = async oldData => {
    const shuttleID = oldData.shuttleID;
    await deleteShuttle({ shuttleID });
    let tmpShuttles = this.state.shuttles;
    tmpShuttles = tmpShuttles.filter(_ => _.shuttleID !== oldData.shuttleID);
    this.setState({ shuttles: tmpShuttles });
    this.showInfoAlert('delete');
  };

  handleAddShuttleRider = async (shuttleID, shuttleName, riderID, riderName) => {
    console.log({riderID, riderName, shuttleID, shuttleName});
    this.closeAddRiderDialog();
    if (shuttleID && shuttleName && riderID && riderName) {
      await createShuttleRider({ shuttleID, shuttleName, riderID, riderName });
      await this.update();
      this.showInfoAlert('add');
    }
  };

  handleDeleteShuttleRider = async (oldData, shuttleID) => {
    const riderID = oldData.riderID;
    await deleteShuttleRider({ shuttleID, riderID });
    await this.update();
    this.showInfoAlert('delete');
  };

  openAddRiderDialog = () => {
    this.setState({ isAddRiderDialogOpen: true });
  };

  closeAddRiderDialog = () => {
    this.setState({ isAddRiderDialogOpen: false });
  };

  showInfoAlert = type => {
    this.infoAlertSeverity = INFO_ALERT_SEVERITY[type];
    this.infoAlertText = INFO_ALERT_TEXT[type];
    this.setState({ isInfoAlertShown: true });
  };

  handleCloseInfoAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      isInfoAlertShown: false,
    });
  };

  renderDetailPanel = rowData => {
    const { t } = this.props;
    const { shuttlesRiders, riders } = this.state;
    const shuttleID = rowData.shuttleID;
    const shuttleName = rowData.name;
    let riderID = '';
    let riderName = '';
    const shuttleRiders = shuttlesRiders[shuttleID];
    return (
      <div style={{ backgroundColor: 'WhiteSmoke', padding: '30px 50px 30px 50px' }}>
        <Dialog fullWidth open={this.state.isAddRiderDialogOpen} onClose={this.closeAddRiderDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{t('shuttles.shuttle.dialog.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ paddingBottom: '5px' }}>
              {`${t('shuttles.shuttle.dialog.choose-rider-to-add')} ${shuttleName}`}
            </DialogContentText>
            <Autocomplete
              id="add-shuttle-rider"
              autoComplete={true}
              openOnFocus={true}
              options={riders}
              getOptionLabel={(option) => `${option.name}, 
                ${t('shuttles.shuttle.dialog.rider-id')} ${option.riderID},
                ${t('shuttles.shuttle.dialog.rider-class')} ${option.class}`}
              style={{ width: 500, paddingBottom: '20px' }}
              onChange={(event, newValue) => {
                if (newValue) {
                  riderID = newValue.riderID;
                  riderName = newValue.name;
                }
              }}
              renderInput={(params) => <TextField {...params} label={t('common.rider')} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAddRiderDialog} color="primary">
              {t('common.cancel')}
            </Button>
            <Button
              onClick={async () =>
                this.handleAddShuttleRider(shuttleID, shuttleName, riderID, riderName)}
              color="primary">
              {t('common.add')}
            </Button>
          </DialogActions>
        </Dialog>
        <Table
          title={
            <Typography
              variant="h5"
              gutterBottom
              style={{ marginLeft: '20px', marginRight: '20px', }}
            >
              {`${t('shuttles.shuttle.title.riders-of')} ${shuttleName}`}
            </Typography>
          }
          actions={[
            {
              icon: tableIcons.Add,
              tooltip: t('shuttles.shuttle.actions.add-rider'),
              isFreeAction: true,
              onClick: this.openAddRiderDialog,
            }
          ]}
          columns={[
            {
              title: t('shuttles.shuttle.table.rider-name'), field: 'riderName',
              headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
            },
            {
              title: t('shuttles.shuttle.table.rider-id'), field: 'riderID',
              headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
            },
          ]}
          data={shuttleRiders || []}
          paging={false}
          addable={false}
          updateable={false}
          deleteable={true}
          tableLayout="fixed"
          handleDelete={async oldData => this.handleDeleteShuttleRider(oldData, shuttleID)}
        />
      </div>
    );
  };

  render() {
    const { t } = this.props;
    const { shuttles, isInfoAlertShown } = this.state;
    const columns = [
      {
        title: t('shuttles.table.name'), field: 'name',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('shuttles.table.contact-name'), field: 'contactName',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('shuttles.table.contact-phone'), field: 'contactPhone',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('shuttles.table.destination'), field: 'destination',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
    ];
    return (
      <div>
        <InfoAlert
          isOpen={isInfoAlertShown}
          onClose={this.handleCloseInfoAlert}
          severity={this.infoAlertSeverity}
          text={this.infoAlertText}
        />
        <Table
          title={
            <Typography
              variant="h5"
              gutterBottom
              style={{ marginLeft: '20px', marginRight: '20px', }}
            >
              {t('shuttles.title')}
            </Typography>
          }
          columns={columns}
          data={shuttles || []}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
          handleDelete={this.handleDelete}
          detailPanel={this.renderDetailPanel}
          addable={true}
          updateable={true}
          deleteable={true}
        />
      </div>
    );
  }
}

export default withTranslation()(Shuttles);
