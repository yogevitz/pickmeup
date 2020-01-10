import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from "../../components/Table";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
}));

class Supervisors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const classes = useStyles();
    return (
      <div>
        <Table
          columns={[
            { title: 'ID', field: 'id', type: 'numeric' },
            { title: 'Name', field: 'name' },
            { title: 'SID', field: 'supervisorID' },
            { title: 'Phone', field: 'phone' },
            {
              title: 'Email',
              field: 'email',
            },
          ]}
          data={[
            {
              id: 1,
              name: 'Yogev Shlomovitz',
              supervisorID: '311530018',
              phone: '0527406333',
              email: 'tal@gmail.com',
            },
            {
              id: 2,
              name: 'Idan Shani',
              supervisorID: '305235517',
              phone: '0543876221',
              email: 'yosi@gmail.com',
            },
            {
              id: 3,
              name: 'Tomer Gabay',
              supervisorID: '316387262',
              phone: '0548332918',
              email: 'rachel@gmail.com',
            },
            {
              id: 4,
              name: 'Hadar Nataf',
              supervisorID: '316460773',
              phone: '0546473827',
              email: 'pnina@gmail.com',
            },
            {
              id: 5,
              name: 'Liad Bercovitch',
              supervisorID: '382726123',
              phone: '0544718732',
              email: 'ofer@gmail.com',
            },
            {
              id: 6,
              name: 'Rotem Sela',
              supervisorID: '317628911',
              phone: '0541112827',
              email: 'roy@gmail.com',
            },
            {
              id: 7,
              name: 'Itamar Biton',
              supervisorID: '311822972',
              phone: '0527362722',
              email: 'eli@gmail.com',
            },
          ]}
        >
        </Table>

      </div>
    );
  }
}

export default Supervisors;
