import React from 'react';
import { Table } from "../../components/Table";
import { InfoAlert, INFO_ALERT_SEVERITY, INFO_ALERT_TEXT } from "../../components/InfoAlert";
import { getAllShuttles, createShuttle, setShuttle, deleteShuttle, getShuttleRidersByShuttle } from '../../proxy';

const columns = [
  { title: 'Name', field: 'name' },
  { title: 'Contact Name', field: 'contactName' },
  { title: 'Contact Phone', field: 'contactPhone' },
  {
    title: 'Destination',
    field: 'destination',
  },
];

class Shuttles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttles: [],
      shuttlesRiders: {},
      isInfoAlertShown: false,
    };
    this.infoAlertSeverity = '';
    this.infoAlertText = '';
  }

  async componentWillMount() {
    const shuttles = await getAllShuttles();
    const shuttlesRiders = {};
    shuttles.forEach(async shuttle => {
      const shuttleID = shuttle.shuttleID;
      const shuttleRiders = await getShuttleRidersByShuttle(shuttleID);
      shuttlesRiders[shuttleID] = shuttleRiders.map(_ => ({
        riderID: _.riderID, riderName: _.riderName,
      }));
    });
    this.setState({ shuttles, shuttlesRiders });
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
    const { shuttlesRiders } = this.state;
    const shuttleID = rowData.shuttleID;
    const shuttleName = rowData.name;
    const riders = shuttlesRiders[shuttleID];
    return (
      <div style={{ backgroundColor: 'WhiteSmoke', padding: '30px 50px 30px 50px' }}>
        <Table
          title={`${shuttleName} Riders`}
          columns={[
            { title: 'Name', field: 'riderName' },
            { title: 'ID', field: 'riderID' },
          ]}
          data={riders}
          addable={true}
          updateable={false}
          deleteable={true}
          tableLayout="fixed"
        />
      </div>
    );
  };

  render() {
    const { shuttles, isInfoAlertShown } = this.state;
    return (
      <div>
        <InfoAlert
          isOpen={isInfoAlertShown}
          onClose={this.handleCloseInfoAlert}
          severity={this.infoAlertSeverity}
          text={this.infoAlertText}
        />
        <Table
          title="Shuttles"
          columns={columns}
          data={shuttles}
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

export default Shuttles;
