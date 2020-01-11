import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from "../../components/Table";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
}));

class Riders extends React.Component {
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
            { title: 'SID', field: 'riderID' },
            { title: 'Parent Name', field: 'parentName' },
            { title: 'Parent Phone', field: 'parentPhone' },
            {
              title: 'Parent Email',
              field: 'parentEmail',
            },
          ]}
          data={[
            {
              id: 1,
              name: 'Benjamin Netanyahu',
              riderID: '204787923',
              parentName: 'Yoni',
              parentPhone: '0547806318',
              parentEmail: 'yoni@gmail.com',
            },
            {
              id: 2,
              name: 'Benny Gantz',
              riderID: '319835517',
              parentName: 'Emanuel',
              parentPhone: '0543989254',
              parentEmail: 'emanuel@gmail.com',
            },
            {
              id: 3,
              name: 'Josh Elgrably',
              riderID: '315483923',
              parentName: 'Claudia',
              parentPhone: '0548332918',
              parentEmail: 'claudia@gmail.com',
            },
            {
              id: 4,
              name: 'Omer Perez',
              riderID: '318819201',
              parentName: 'Lotem',
              parentPhone: '0523637687',
              parentEmail: 'locoloco@gmail.com',
            },
            {
              id: 5,
              name: 'Idan Koper',
              riderID: '382724423',
              parentName: 'Daniel',
              parentPhone: '0544718732',
              parentEmail: 'daniel@gmail.com',
            },
            {
              id: 6,
              name: 'Liron Lillian',
              riderID: '317628911',
              parentName: 'Roy',
              parentPhone: '0541112827',
              parentEmail: 'roy@gmail.com',
            },
            {
              id: 7,
              name: 'Shay Lasri',
              riderID: '311888822',
              parentName: 'Eli',
              parentPhone: '0527362722',
              parentEmail: 'eli@gmail.com',
            },
            {
              id: 8,
              name: 'Rotem Sela',
              riderID: '205678687',
              parentName: 'Lilach',
              parentPhone: '0526474643',
              parentEmail: 'lilach@gmail.com',
            },
            {
              id: 9,
              name: 'Dor Abargel',
              riderID: '311724423',
              parentName: 'Itzik',
              parentPhone: '0524009890',
              parentEmail: 'itzik@gmail.com',
            },
            {
              id: 10,
              name: 'Don Omar',
              riderID: '208908121',
              parentName: 'Fonsi',
              parentPhone: '0544981618',
              parentEmail: 'fonsi@gmail.com',
            },
            {
              id: 11,
              name: 'David Levi',
              riderID: '309823214',
              parentName: 'Moshe',
              parentPhone: '0542887675',
              parentEmail: 'moshe@gmail.com',
            },
          ]}
        />
      </div>
    );
  }
}

export default Riders;
