import React from 'react';
import Table from "../../components/Table";
import Grid from "@material-ui/core/Grid";
import { getAllRiders, getAllShuttlesRiders, createRider, deleteRider, setRider } from '../../proxy';

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
    };
  }

  async componentWillMount() {
    let riders = await getAllRiders();
    const shuttlesRiders = await getAllShuttlesRiders();
    const ridersShuttles = {};
    riders.forEach(rider => {
      const riderID = rider.riderID;
      const riderShuttles = shuttlesRiders.filter(_ => _.riderID === riderID);
      ridersShuttles[riderID] = riderShuttles
        .map(_ => ({ shuttleID: _.shuttleID, shuttleName: _.shuttleName }));
    });
    this.setState({ riders, ridersShuttles });
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

  renderDetailPanel = rowData => {
    const { ridersShuttles } = this.state;
    const riderID = rowData.riderID;
    const riderName = rowData.name;
    const shuttles = ridersShuttles[riderID];
    console.log(shuttles);
    return (
      <Grid container justify="center" style={{ textAlign: 'center' }}>
        <Table
          title={`${riderName}'s Shuttles`}
          columns={[
            { title: 'Name', field: 'shuttleName' },
            { title: 'Shuttle ID', field: 'shuttleID' },
          ]}
          data={shuttles}
          paging={false}
          editable={true}
          tableLayout="fixed"
        />
      </Grid>
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
          editable={true}
        />
      </div>
    );
  }
}

export default Riders;
