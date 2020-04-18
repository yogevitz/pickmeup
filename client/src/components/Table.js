import React, { forwardRef } from 'react';
import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import AddBox from '@material-ui/icons/AddBox';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import Remove from '@material-ui/icons/Remove';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    }
  }

  componentWillMount() {
    this.setState({
      data: this.props.data,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        data: this.props.data.map(_ => _),
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      data: nextProps.data,
    });
  }

  onAdd = newData => {
    const { handleAdd } = this.props;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
        newData.tableData = {
          id: this.props.data.length
        };
        handleAdd(newData);
      }, 600);
    });
  };

  onUpdate = (newData, oldData) => {
    const { handleUpdate } = this.props;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
        if (oldData) {
          handleUpdate(newData);
        }
      }, 600);
    });
  };

  onDelete = oldData => {
    const { handleDelete } = this.props;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
        if (oldData) {
          handleDelete(oldData);
        }
      }, 600);
    });
  };

  render() {
    const { columns, title, editable, detailPanel, tableLayout, pageSize } = this.props;
    const { data } = this.state;
    return (
      <MaterialTable
        title={title}
        columns={columns}
        data={data}
        icons={tableIcons}
        options={{
          pageSize: pageSize || 10,
          toolbar: true,
          paging: true,
          search: true,
          tableLayout: tableLayout || "auto",
          detailPanelType: 'single',
          exportButton: true,
        }}
        editable={editable
          ? {
            onRowAdd: this.onAdd,
            onRowUpdate: this.onUpdate,
            onRowDelete: this.onDelete,
          } : undefined}
        detailPanel={detailPanel}
        onRowClick={editable && detailPanel
          ? (event, rowData, togglePanel) => togglePanel()
          : undefined}
      />
    );
  }
}

export default Table;
