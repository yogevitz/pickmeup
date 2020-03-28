import React from 'react';
import Table from "../../components/Table";
import { getAllRiders } from '../../proxy';

class Riders extends React.Component {
  constructor(props) {
    super(props);
    this.getRiders();
    this.state = {
      columns: [
        { title: 'ID', field: 'riderId' },
        { title: 'Name', field: 'name' },
        { title: 'Parent Name', field: 'parentName' },
        { title: 'Parent Phone', field: 'parentPhone' },
        {
          title: 'Parent Email',
          field: 'parentEmail',
        },
      ],
    };
  }

  getRiders = async () => {
    this.setState({
      riders: await getAllRiders(),
    });
  };

  render() {
    return (
      <div>
        <Table
          columns={this.state.columns}
          data={this.state.riders}
        />
      </div>
    );
  }
}

export default Riders;
