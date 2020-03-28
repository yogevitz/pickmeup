import React from 'react';
import Table from "../../components/Table";
import { getAllSupervisors, createSupervisor, setSupervisor } from '../../proxy';

const columns = [
  { title: 'ID', field: 'sid' },
  { title: 'Name', field: 'name' },
  { title: 'Phone', field: 'phone' },
  {
    title: 'Email',
    field: 'email',
  },
];

class Supervisors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supervisors: [],
    };
  }

  async componentWillMount() {
    const supervisors = await getAllSupervisors();
    this.setState({ supervisors: supervisors });
  }

  handleAdd = async newData => {
    await createSupervisor(newData);
    const tmpSupervisors = this.state.supervisors;
    tmpSupervisors.push(newData);
    this.setState({ supervisors: tmpSupervisors });
  };

  handleUpdate = async newData => {
    await setSupervisor(newData);
    let tmpSupervisors = this.state.supervisors;
    tmpSupervisors = tmpSupervisors.filter(_ => _.supervisorID !== newData.supervisorID);
    tmpSupervisors.push(newData);
    this.setState({ supervisors: tmpSupervisors });
  };

  handleDelete = async oldData => {
    // TODO: uncomment once deleteSupervisor is implemented:
    // await deleteSupervisor(oldData);
    let tmpSupervisors = this.state.supervisors;
    tmpSupervisors = tmpSupervisors.filter(_ => _.supervisorID !== oldData.supervisorID);
    this.setState({ supervisors: tmpSupervisors });
  };

  render() {
    const { supervisors } = this.state;
    return (
      <div>
        <Table
          title="Supervisors"
          columns={columns}
          data={supervisors}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
          handleDelete={this.handleDelete}
        />
      </div>
    );
  }
}

export default Supervisors;
