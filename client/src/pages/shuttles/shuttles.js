import React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from "../../components/Table";
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
    };
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
  };

  handleUpdate = async newData => {
    await setShuttle(newData);
    let tmpShuttles = this.state.shuttles;
    tmpShuttles = tmpShuttles.filter(_ => _.shuttleID !== newData.shuttleID);
    tmpShuttles.push(newData);
    this.setState({ shuttles: tmpShuttles });
  };

  handleDelete = async oldData => {
    const shuttleID = oldData.shuttleID;
    await deleteShuttle({ shuttleID });
    let tmpShuttles = this.state.shuttles;
    tmpShuttles = tmpShuttles.filter(_ => _.shuttleID !== oldData.shuttleID);
    this.setState({ shuttles: tmpShuttles });
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
    const { shuttles } = this.state;
    return (
      <div>
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
