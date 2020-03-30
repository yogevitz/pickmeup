import React from 'react';
import AttendanceList from '../../components/AttendanceList';

import { getAllShuttleRiders } from "../../proxy";

const columns = [
  { title: 'Name', field: 'riderName' },
  { title: 'ID', field: 'riderID' },
];

class WarRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttlesRiders: [],
      checked: [],
    };
  }

  getRiderRowData = rider => ({ ...rider, tableData: { checked: rider.mark === '1' } });

  async componentWillMount() {
    let shuttleRiders = await getAllShuttleRiders(1);
    shuttleRiders = shuttleRiders.map(this.getRiderRowData);
    this.setState({ shuttleRiders: shuttleRiders });
  }

  render() {
    const { shuttleRiders } = this.state;
    return (
      <AttendanceList
        title="Beer Sheva Shuttle 1"
        columns={columns}
        selection={true}
        data={shuttleRiders}
        onSelectionChange={() => {}}
      />
    );
  }
}

export default WarRoom;
