import React from 'react';
import Table from "../../components/Table";
import { getAllShuttles, createShuttle, setShuttle } from '../../proxy';

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
    };
  }

  async componentWillMount() {
    const shuttles = await getAllShuttles();
    this.setState({ shuttles: shuttles });
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
    // TODO: uncomment once deleteShuttle is implemented:
    // await deleteShuttle(oldData);
    let tmpShuttles = this.state.shuttles;
    tmpShuttles = tmpShuttles.filter(_ => _.shuttleID !== oldData.shuttleID);
    this.setState({ shuttles: tmpShuttles });
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
        />
      </div>
    );
  }
}

export default Shuttles;
