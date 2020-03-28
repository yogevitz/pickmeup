import React from 'react';
import Table from "../../components/Table";
import { getAllShuttles } from '../../proxy';

class Shuttles extends React.Component {
  constructor(props) {
    super(props);
    this.getShuttles();
    this.state = {
      columns: [
        { title: 'ID', field: 'shuttleId' },
        { title: 'Name', field: 'name' },
        { title: 'Contact Name', field: 'contactName' },
        { title: 'Contact Phone', field: 'contactPhone' },
        {
          title: 'Destination',
          field: 'destination',
        },
      ],
    };
  }

  getShuttles = async () => {
    this.setState({
      shuttles: await getAllShuttles(),
    });
  };

  render() {
    console.log(this.state.shuttles);
    return (
      <div>
        <Table
          columns={this.state.columns}
          data={this.state.shuttles}
        />
      </div>
    );
  }
}

export default Shuttles;
