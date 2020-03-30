import React from 'react';
import AttendanceList from '../../components/AttendanceList';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';

import { getAllShuttleRiders, markRider } from "../../proxy";

const columns = [
  { title: 'Name', field: 'riderName' },
  { title: 'ID', field: 'riderID' },
];

class WarRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shuttleRiders: [],
    };
    this.checked = [];
  }

  onSelectionChange = async selected => {
    const selectedIDs = selected.map(_ => _.riderID);
    let newChecked, newUnChecked;
    if (selectedIDs.length > this.checked.length) {
      newChecked = selectedIDs.filter(x => this.checked.indexOf(x) < 0);
      this.checked.push(...newChecked);
      newChecked.forEach(async checked => await markRider({
        shuttleID: '1',
        riderID: checked,
        date: '31/03/2020',
        direction: 'Morning',
        mark: '1',
      }));
    } else {
      newUnChecked = this.checked.filter(x => selectedIDs.indexOf(x) < 0);
      this.checked = this.checked.filter(_ => newUnChecked.indexOf(_) < 0);
      newUnChecked.forEach(async unChecked => await markRider({
        shuttleID: '1',
        riderID: unChecked,
        date: '31/03/2020',
        direction: 'Morning',
        mark: '0',
      }));
    }
  };

  getRiderRowData = rider => {
    const checked = rider.mark === '1';
    checked && this.checked.push(rider.riderID);
    return ({ ...rider, tableData: { checked } });
  };

  update = async () => {
    let shuttleRiders = await getAllShuttleRiders(1);
    shuttleRiders = shuttleRiders.map(this.getRiderRowData);
    this.setState({ shuttleRiders: shuttleRiders });
  };

  async componentDidMount() {
    await this.update();
  }

  render() {
    const { shuttleRiders } = this.state;
    return (
      <Grid>
        <Grid container>
          <Button variant="contained" onClick={this.update}>
            <RefreshIcon/>
          </Button>
        </Grid>
        <div style={{marginTop: '15px'}}>
          <AttendanceList
            title="Beer Sheva Shuttle"
            columns={columns}
            selection={true}
            data={shuttleRiders}
            onSelectionChange={this.onSelectionChange}
          />
        </div>
      </Grid>
    );
  }
}

export default WarRoom;
