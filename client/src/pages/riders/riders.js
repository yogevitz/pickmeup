import React from 'react';
import { Table, tableIcons } from "../../components/Table";
import { InfoAlert, INFO_ALERT_SEVERITY, INFO_ALERT_TEXT } from "../../components/InfoAlert";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import QRCode from 'qrcode.react';
import { getAllRiders, getAllShuttles, getAllShuttlesRiders, createShuttleRider, deleteShuttleRider, createRider, deleteRider, setRider , uploadRiders} from '../../proxy';
let csv = require("csvtojson");

const columns = [
  { title: 'ID', field: 'riderID' },
  { title: 'Name', field: 'name' },
  { title: 'Teacher', field: 'teacher' },
  { title: 'Class', field: 'class' },
  { title: 'Parent Name', field: 'parentName' },
  { title: 'Parent Phone', field: 'parentPhone' },
  {
    title: 'Parent Email',
    field: 'parentEmail',
  },
];

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
  onClickHandler1=async ()=> {
    const data = new FormData();
    let Riders = {};
    const reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      console.log(event.target.result)
      let csv = reader.result;
      let lines = csv.split("\n");
      let result = [];
      let headers=lines[0].split(",");
      for(let i=1;i<lines.length;i++){
        let obj = {};
        let currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      //return result; //JavaScript object
      result= JSON.stringify(result); //JSON
      console.log(result);
      Riders = result;
        uploadRiders({ Riders });

    };
    reader.readAsText(this.state.selectedFile);
    /*
    data.append('file', this.state.selectedFile);
    reader.readAsArrayBuffer(this.state.selectedFile);
    reader.onload =function(e){
      Riders = e.target.result;
      console.log(Riders);
    }
     */
    //console.log(this.state.selectedFile);
    //reader.readAsText(this.state.selectedFile);
    //await uploadRiders({ Riders });
  };

  renderDetailPanel = rowData => {
    const { ridersShuttles, shuttles } = this.state;
    const riderID = rowData.riderID;
    const riderName = rowData.name;
    let shuttleID = '';
    let shuttleName = '';
    const riderShuttles = ridersShuttles[riderID];
    return (
      <div style={{ backgroundColor: 'WhiteSmoke', padding: '30px 50px 30px 50px' }}>
        <Dialog fullWidth open={this.state.isAddShuttleDialogOpen} onClose={this.closeAddShuttleDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{`Add Shuttle`}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ paddingBottom: '5px' }}>
              {`Choose a shuttle to add to ${riderName}'s shuttles`}
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
              renderInput={(params) => <TextField {...params} label="Shuttle" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAddShuttleDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={async () =>
                this.handleAddRiderShuttle(riderID, riderName, shuttleID, shuttleName)}
              color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Table
          title={`${riderName}'s Shuttles`}
          actions={[
            {
              icon: tableIcons.Add,
              tooltip: 'Add Shuttle',
              isFreeAction: true,
              onClick: this.openAddShuttleDialog,
            }
          ]}
          columns={[
            {
              title: 'Name',
              field: 'shuttleName',
            },
            {
              title: 'Shuttle ID',
              field: 'shuttleID',
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
  onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  }
  render() {

    const { riders, isInfoAlertShown } = this.state;
    return (
      <div>
        <input type="file" name="file" style={{display: 'flex', justifyContent:'center', alignItems:'center'}} onChange={this.onChangeHandler} accept=".csv"/>
        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler1}>Upload</button>
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
              Cancel
            </Button>
            <Button
              onClick={this.downloadQR}
              color="primary">
              Export
            </Button>
          </DialogActions>
        </Dialog>
        <Table
          title="Riders"
          columns={columns}
          data={riders}
          actions={[
            {
              icon: tableIcons.CropFree,
              tooltip: 'Create QR Code',
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

export default Riders;
