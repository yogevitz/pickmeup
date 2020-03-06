import React from 'react';
import Table from "../../components/Table";
import { getAllShuttles } from '../../proxy';

class Shuttles extends React.Component {
  constructor(props) {
    super(props);
    this.getShuttles();
    this.state = {
      columns: [
        { title: 'ID', field: 'id', type: 'numeric' },
        { title: 'Name', field: 'name' },
        { title: 'Contact Name', field: 'contactName' },
        { title: 'Contact Phone', field: 'contactPhone' },
        {
          title: 'Destination',
          field: 'destination',
        },
      ],
      shuttles: [
        {
          id: 1,
          name: 'Beer Sheva Yellow Bus',
          contactName: 'Yosi Cohen',
          contactPhone: '0528108333',
          destination: 'Beer Sheva',
        },
        {
          id: 2,
          name: 'Beit Kama Mini Bus',
          contactName: 'Ben Levi',
          contactPhone: '0523712321',
          destination: 'Beit Kama',
        },
        {
          id: 3,
          name: 'BK Large Bus',
          contactName: 'Goni Levin Haimi',
          contactPhone: '0548332918',
          destination: 'Beit Kama',
        },
        {
          id: 4,
          name: 'Rahat 10',
          contactName: 'Hassan Abudugush',
          contactPhone: '0546478899',
          destination: 'Rahat',
        },
        {
          id: 5,
          name: 'Lehavim School Bus',
          contactName: 'Yaniv Gabot',
          contactPhone: '0544718732',
          destination: 'Lehavim',
        },
        {
          id: 6,
          name: 'Mishmar 2',
          contactName: 'Dani Duenias',
          contactPhone: '0541112827',
          destination: 'Mishmar Hanegev',
        },
      ],
    };
  }

  getShuttles = async () => {
    const newShuttles = await getAllShuttles();
    this.setState(() => ({
      shuttles: newShuttles
    }));
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
