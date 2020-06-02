import React from 'react';
import Table from "../../components/Table";
import { tableIcons } from "../../utils";
import { InfoAlert, INFO_ALERT_SEVERITY, INFO_ALERT_TEXT } from "../../components/InfoAlert";
import { withTranslation } from "react-i18next";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";
import QRCode from 'qrcode.react';
import { getAllRiders, getAllShuttles, getAllShuttlesRiders, createShuttleRider, deleteShuttleRider, createRider, deleteRider, setRider , uploadRiders} from '../../proxy';
let csv = require("csvtojson");

class Riders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      riders: [],
      ridersShuttles: {},
      shuttles: [],
      isAddShuttleDialogOpen: false,
      isQRCodeDialogOpen: false,
      isInfoAlertShown: false,
      selectedFile: null,

    };
    this.infoAlertSeverity = '';
    this.infoAlertText = '';
    this.qrCodeName = '';
    this.qrCodeValue = '';
  }

  async update() {
    let riders = await getAllRiders();
    const shuttles = await getAllShuttles();
    const shuttlesRiders = await getAllShuttlesRiders();
    const ridersShuttles = {};
    riders.forEach(rider => {
      const riderID = rider.riderID;
      const riderShuttles = shuttlesRiders.filter(_ => _.riderID === riderID);
      ridersShuttles[riderID] = riderShuttles
        .map(_ => ({ shuttleID: _.shuttleID, shuttleName: _.shuttleName }));
    });
    this.setState({ riders, shuttles, ridersShuttles });
  }

  async componentWillMount() {
    await this.update();
  }

  handleAdd = async newData => {
    await createRider(newData);
    const tmpRiders = this.state.riders;
    tmpRiders.push(newData);
    this.setState({ riders: tmpRiders });
    this.showInfoAlert('add');
  };

  handleUpdate = async newData => {
    await setRider(newData);
    let tmpRiders = this.state.riders;
    tmpRiders = tmpRiders.filter(_ => _.riderID !== newData.riderID);
    tmpRiders.push(newData);
    this.setState({ riders: tmpRiders });
    this.showInfoAlert('update');
  };

  handleDelete = async oldData => {
    const riderID = oldData.riderID;
    await deleteRider({ riderID });
    let tmpRiders = this.state.riders;
    tmpRiders = tmpRiders.filter(_ => _.riderID !== oldData.riderID);
    this.setState({ riders: tmpRiders });
    this.showInfoAlert('delete');
  };

  handleAddRiderShuttle = async (riderID, riderName, shuttleID, shuttleName) => {
    this.closeAddShuttleDialog();
    if (riderID && riderName && shuttleID && shuttleName) {
      await createShuttleRider({ shuttleID, shuttleName, riderID, riderName });
      await this.update();
      this.showInfoAlert('add');
    }
  };

  handleDeleteRiderShuttle = async (oldData, riderID) => {
    const shuttleID = oldData.shuttleID;
    await deleteShuttleRider({ shuttleID, riderID });
    await this.update();
    this.showInfoAlert('delete');
  };

  openAddShuttleDialog = () => {
    this.setState({ isAddShuttleDialogOpen: true });
  };

  closeAddShuttleDialog = () => {
    this.setState({ isAddShuttleDialogOpen: false });
  };

  openQRCodeDialog = (event, rowData) => {
    this.setState({ isQRCodeDialogOpen: true });
    this.qrCodeName = rowData.name;
    this.qrCodeValue = rowData.riderID;
  };

  closeQRCodeDialog = () => {
    this.setState({ isQRCodeDialogOpen: false });
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

  onClickImport = async () => {
    const data = new FormData();
    let riders = {};
    const reader = new FileReader();
    reader.onload = async function(event) {
      // The file's text will be printed here
      console.log(event.target.result);
      let csv = reader.result;
      let lines = csv.split("\n");
      let result = [];
      let headers = lines[0].split(",");
      for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      //return result; //JavaScript object
      result = JSON.stringify(result); //JSON
      console.log(result);
      riders = result;
      await uploadRiders({ riders });
    };
    reader.readAsText(this.state.selectedFile);
    /*
    data.append('file', this.state.selectedFile);
    reader.readAsArrayBuffer(this.state.selectedFile);
    reader.onload =function(e){
      riders = e.target.result;
      console.log(riders);
    }
     */
    //console.log(this.state.selectedFile);
    //reader.readAsText(this.state.selectedFile);
    //await uploadriders({ riders });
  };

  renderDetailPanel = rowData => {
    const { t } = this.props;
    const { ridersShuttles, shuttles } = this.state;
    const riderID = rowData.riderID;
    const riderName = rowData.name;
    let shuttleID = '';
    let shuttleName = '';
    const riderShuttles = ridersShuttles[riderID];
    return (
      <div style={{ backgroundColor: 'WhiteSmoke', padding: '30px 50px 30px 50px' }}>
        <Dialog fullWidth open={this.state.isAddShuttleDialogOpen} onClose={this.closeAddShuttleDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{t('riders.rider.dialog.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ paddingBottom: '5px' }}>
              {`${t('riders.rider.dialog.choose-shuttle-to-add')} ${riderName}`}
            </DialogContentText>
            <Autocomplete
              id="add-rider-shuttle"
              autoComplete={true}
              openOnFocus={true}
              options={shuttles}
              getOptionLabel={(option) => option.name}
              style={{ width: 500, paddingBottom: '20px' }}
              onChange={(event, newValue) => {
                if (newValue) {
                  shuttleID = newValue.shuttleID;
                  shuttleName = newValue.name;
                }
              }}
              renderInput={(params) => <TextField {...params} label={t('common.shuttle')} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAddShuttleDialog} color="primary">
              {t('common.cancel')}
            </Button>
            <Button
              onClick={async () =>
                this.handleAddRiderShuttle(riderID, riderName, shuttleID, shuttleName)}
              color="primary">
              {t('common.add')}
            </Button>
          </DialogActions>
        </Dialog>
        <Table
          title={`${t('riders.rider.title.shuttles-of')} ${riderName}`}
          actions={[
            {
              icon: tableIcons.Add,
              tooltip: t('riders.rider.actions.add-shuttle'),
              isFreeAction: true,
              onClick: this.openAddShuttleDialog,
            }
          ]}
          columns={[
            {
              title: t('riders.rider.table.shuttle-name'),
              field: 'shuttleName',
              headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
            },
            {
              title: t('riders.rider.table.shuttle-id'),
              field: 'shuttleID',
              headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
            },
          ]}
          options={{
            actionsColumnIndex: 4,
          }}
          data={riderShuttles}
          paging={false}
          addable={false}
          updateable={false}
          deleteable={true}
          tableLayout="fixed"
          handleDelete={async oldData => this.handleDeleteRiderShuttle(oldData, riderID)}
        />
      </div>
    );
  };

  downloadQR = () => {
    let canvas = document.getElementById("qr-code-canvas");
    let url = canvas.toDataURL("image/png");
    let link = document.createElement('a');
    link.download = `${this.qrCodeName}.png`;
    link.href = document.getElementById('qr-code-canvas').toDataURL();
    link.click();
  };

  onChangeFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };

  render() {
    const { t } = this.props;
    const { riders, isInfoAlertShown } = this.state;
    const isShowImport = false;
    const columns = [
      {
        title: t('riders.table.ID'), field: 'riderID',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('riders.table.name'), field: 'name',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('riders.table.teacher'), field: 'teacher',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('riders.table.class'), field: 'class',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('riders.table.parent-name'), field: 'parentName',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      {
        title: t('riders.table.parent-phone'), field: 'parentPhone',
        headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      },
      // {
      //   title: t('riders.table.parent-email'), field: 'parentEmail',
      //   headerStyle: { textAlign: 'right' }, cellStyle: { textAlign: 'right' },
      // },
    ];
    return (
      <div>
        {isShowImport && (
          <div>
            <input
              type="file"
              name="file"
              style={{display: 'flex', justifyContent:'center', alignItems:'center'}}
              onChange={this.onChangeFile}
              accept=".csv"
            />
            <button
              type="button"
              className="btn btn-success btn-block"
              onClick={this.onClickImport}
            >
              Upload
            </button>
          </div>)}
        <InfoAlert
          isOpen={isInfoAlertShown}
          onClose={this.handleCloseInfoAlert}
          severity={this.infoAlertSeverity}
          text={this.infoAlertText}
        />
        <Dialog fullWidth open={this.state.isQRCodeDialogOpen} onClose={this.closeQRCodeDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="qr-code-dialog">{`QR Code for ${this.qrCodeName}`}</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column', margin: 'auto', width: 'fit-content' }}>
            <QRCode id='qr-code-canvas' value={this.qrCodeValue} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeQRCodeDialog} color="primary">
              {t('common.cancel')}
            </Button>
            <Button
              onClick={this.downloadQR}
              color="primary">
              {t('common.export')}
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
              {t('riders.title')}
            </Typography>
          }
          columns={columns}
          data={riders}
          actions={[
            {
              icon: tableIcons.CropFree,
              tooltip: t('toolbar.create-qr-code'),
              onClick: this.openQRCodeDialog
            }
          ]}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
          handleDelete={this.handleDelete}
          detailPanel={this.renderDetailPanel}
          paging={true}
          addable={true}
          updateable={true}
          deleteable={true}
        />
      </div>
    );
  }
}

export default withTranslation()(Riders);
