import React from 'react';
import { Table, tableIcons } from "../../components/Table";
import { getAllRiders, getAllShuttles, getAllShuttlesRiders, createRider, deleteRider, setRider } from '../../proxy';

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
    };
  }

  async componentWillMount() {
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

  handleAdd = async newData => {
    await createRider(newData);
    const tmpRiders = this.state.riders;
    tmpRiders.push(newData);
    this.setState({ riders: tmpRiders });
  };

  handleUpdate = async newData => {
    await setRider(newData);
    let tmpRiders = this.state.riders;
    tmpRiders = tmpRiders.filter(_ => _.riderID !== newData.riderID);
    tmpRiders.push(newData);
    this.setState({ riders: tmpRiders });
  };

  handleDelete = async oldData => {
    const riderID = oldData.riderID;
    await deleteRider({ riderID });
    let tmpRiders = this.state.riders;
    tmpRiders = tmpRiders.filter(_ => _.riderID !== oldData.riderID);
    this.setState({ riders: tmpRiders });
  };

  handleAddRiderShuttle = async newData => {};

  handleDeleteRiderShuttle = async oldData => {};

  renderDetailPanel = rowData => {
    const { ridersShuttles, shuttles } = this.state;
    const riderID = rowData.riderID;
    const riderName = rowData.name;
    const riderShuttles = ridersShuttles[riderID];
    return (
      <div style={{ backgroundColor: 'WhiteSmoke', padding: '30px 50px 30px 50px' }}>
        <Table
          title={`${riderName}'s Shuttles`}
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
          addable={true}
          updateable={false}
          deleteable={true}
          tableLayout="fixed"
          handleAdd={this.handleAddRiderShuttle}
          handleDelete={this.handleDeleteRiderShuttle}
        />
      </div>
    );
  };

  render() {
    const { riders } = this.state;
    return (
      <div>
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
