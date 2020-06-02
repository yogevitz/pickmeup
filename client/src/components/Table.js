import React, { forwardRef } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { tableIcons } from '../utils';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
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
    const {
      columns,
      actions,
      title,
      addable,
      updateable,
      deleteable,
      detailPanel,
      paging,
      pageSize,
    } = this.props;
    const { data } = this.state;
    return (
      <MaterialTable
        title={title}
        columns={columns}
        data={data}
        icons={tableIcons}
        actions={actions}
        options={{
          pageSize: pageSize || 10,
          toolbar: true,
          paging: paging || false,
          search: true,
          tableLayout: "auto",
          detailPanelType: 'single',
          exportButton: true,
          exportAllData: true,
          toolbarButtonAlignment: 'right',
          actionsColumnIndex: -1,
          showEmptyDataSourceMessage: false,
        }}
        editable={addable || updateable || deleteable ? {
          onRowAdd: addable ? this.onAdd : undefined,
          onRowUpdate: updateable ? this.onUpdate : undefined,
          onRowDelete: deleteable ? this.onDelete : undefined,
        } : undefined}
        detailPanel={detailPanel}
        onRowClick={detailPanel
          ? (event, rowData, togglePanel) => togglePanel()
          : undefined}
        components={{
          Toolbar: props => (
            <MTableToolbar {...props} columnsButton={true} />
          )
        }}
      />
    );
  }
}
