import React from 'react';
import { Table, tableIcons } from "../../components/Table";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { getAllRiders, getAllShuttles, getAllShuttlesRiders, createShuttleRider, deleteShuttleRider, createRider, deleteRider, setRider } from '../../proxy';

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
      isAddSnackbarOpen: false,
      isDeleteSnackbarOpen: false,
      isUpdateSnackbarOpen: false,
    };
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
    this.openSnackbar('add');
  };

  handleUpdate = async newData => {
    await setRider(newData);
    let tmpRiders = this.state.riders;
    tmpRiders = tmpRiders.filter(_ => _.riderID !== newData.riderID);
    tmpRiders.push(newData);
    this.setState({ riders: tmpRiders });
    this.openSnackbar('update');
  };

  handleDelete = async oldData => {
    const riderID = oldData.riderID;
    await deleteRider({ riderID });
    let tmpRiders = this.state.riders;
    tmpRiders = tmpRiders.filter(_ => _.riderID !== oldData.riderID);
    this.setState({ riders: tmpRiders });
    this.openSnackbar('delete');
  };

  handleAddRiderShuttle = async (riderID, riderName, shuttleID, shuttleName) => {
    this.closeAddShuttleDialog();
    if (riderID && riderName && shuttleID && shuttleName) {
      await createShuttleRider({ shuttleID, shuttleName, riderID, riderName });
      await this.update();
      this.openSnackbar('add');
    }
  };

  handleDeleteRiderShuttle = async (oldData, riderID) => {
    const shuttleID = oldData.shuttleID;
    await deleteShuttleRider({ shuttleID, riderID });
    await this.update();
    this.openSnackbar('delete');
  };

  openAddShuttleDialog = () => {
    this.setState({ isAddShuttleDialogOpen: true });
  };

  closeAddShuttleDialog = () => {
    this.setState({ isAddShuttleDialogOpen: false });
  };

  openSnackbar = type => {
    this.setState(type === 'add'
      ? { isAddSnackbarOpen: true }
      : type === 'update'
        ? { isUpdateSnackbarOpen: true }
        : { isDeleteSnackbarOpen: true });
  };

  closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      isAddSnackbarOpen: false,
      isDeleteSnackbarOpen: false,
      isUpdateSnackbarOpen: false
    });
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
              tooltip: 'Add User',
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

  renderSnackbars = () => {
    const { isAddSnackbarOpen, isDeleteSnackbarOpen, isUpdateSnackbarOpen } = this.state;
    return (
      <div>
        <Snackbar open={isAddSnackbarOpen} autoHideDuration={3000} onClose={this.closeSnackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={this.closeSnackbar} severity="success">
            Successfully Added :)
          </MuiAlert>
        </Snackbar>
        <Snackbar open={isDeleteSnackbarOpen} autoHideDuration={3000} onClose={this.closeSnackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={this.closeSnackbar} severity="info">
            Successfully Deleted!
          </MuiAlert>
        </Snackbar>
        <Snackbar open={isUpdateSnackbarOpen} autoHideDuration={3000} onClose={this.closeSnackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={this.closeSnackbar} severity="info">
            Successfully Updated!
          </MuiAlert>
        </Snackbar>
      </div>
    );
  };

  render() {
    const { riders } = this.state;
    return (
      <div>
        {this.renderSnackbars()}
        <Table
          title="Riders"
          columns={columns}
          data={riders}
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
