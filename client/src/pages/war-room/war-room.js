import React from 'react';
import AttendanceList from '../../components/AttendanceList';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';

import { getLiftRiders, setLiftRiderMark, setLiftRiderApproved } from "../../proxy";

const columns = [
  { title: 'Name', field: 'riderName' },
  { title: 'ID', field: 'riderID' },
  { title: 'Parent Name', field: 'parentName' },
  { title: 'Parent Phone', field: 'parentPhone' },
];

class WarRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liftRiders: [],
    };
    this.checked = [];
  }

  onSelectionChange = async selected => {
    const selectedIDs = selected.map(_ => _.riderID);
    let newChecked, newUnChecked;
    let newLiftRiders = this.state.liftRiders;
    if (selectedIDs.length > this.checked.length) {
      newChecked = selectedIDs.filter(x => this.checked.indexOf(x) < 0);
      this.checked.push(...newChecked);
      newChecked.forEach(async checked => {
        await setLiftRiderMark({
          shuttleID: '1',
          riderID: checked,
          date: '15-04-2020',
          direction: 'Afternoon',
          mark: '1',
        });
        const tmpLiftRider = newLiftRiders.find(_ => _.riderID === checked);
        tmpLiftRider.mark = '1';
        tmpLiftRider.approved = '0';
        tmpLiftRider.tableData.checked = true;
      });
    } else {
      newUnChecked = this.checked.filter(x => selectedIDs.indexOf(x) < 0);
      this.checked = this.checked.filter(_ => newUnChecked.indexOf(_) < 0);
      newUnChecked.forEach(async unChecked => {
        await setLiftRiderMark({
          shuttleID: '1',
          riderID: unChecked,
          date: '15-04-2020',
          direction: 'Afternoon',
          mark: '0',
        });
        const tmpLiftRider = newLiftRiders.find(_ => _.riderID === unChecked);
        tmpLiftRider.mark = '0';
        tmpLiftRider.tableData.checked = false;
      });
    }
    this.setState({ liftRiders: newLiftRiders });
  };

  onApproveChange = async (event, rowProps) => {
    const isApproved = event.target.checked;
    const riderID = rowProps.data.riderID;
    let newLiftRiders = this.state.liftRiders;
    const tmpLiftRider = newLiftRiders.find(_ => _.riderID === riderID);
    tmpLiftRider.approved = isApproved ? '1' : '0';
    await setLiftRiderApproved({
      shuttleID: '1',
      riderID,
      date: '15-04-2020',
      direction: 'Afternoon',
      approved: isApproved ? '1' : '0',
    });
    this.setState({ liftRiders: newLiftRiders });
  };

  getRiderRowData = rider => {
    const checked = rider.mark === '1';
    const approved = rider.approved;
    checked && this.checked.push(rider.riderID);
    return ({ ...rider, approved, tableData: { checked } });
  };

  update = async () => {
    let liftRiders = await getLiftRiders({ shuttleID: '1', date: '15-04-2020', direction: 'Afternoon' });
    liftRiders = liftRiders.map(this.getRiderRowData);
    this.setState({ liftRiders: liftRiders });
  };

  async componentDidMount() {
    await this.update();
  }

  render() {
    const { liftRiders } = this.state;
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
            data={liftRiders}
            onSelectionChange={this.onSelectionChange}
            onApproveChange={this.onApproveChange}
          />
        </div>
      </Grid>
    );
  }
}

export default WarRoom;
