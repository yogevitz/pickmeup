import React from 'react';
import Table from "../../components/Table";
import { getAllSupervisors } from '../../proxy';

class Supervisors extends React.Component {
  constructor(props) {
    super(props);
    this.getSupervisors();
    this.state = {
      columns: [
        { title: 'ID', field: 'supervisorId' },
        { title: 'Name', field: 'name' },
        { title: 'Phone', field: 'phone' },
        {
          title: 'Email',
          field: 'email',
        },
      ],
    };
  }

  getSupervisors = async () => {
    this.setState({
      supervisors: await getAllSupervisors(),
    });
  };

  render() {
    return (
      <div>
        <Table
          columns={this.state.columns}
          data={this.state.supervisors}
        />
      </div>
    );
  }
}

export default Supervisors;
