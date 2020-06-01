import React from 'react';
import { Table } from "../../components/Table";
import { withTranslation } from "react-i18next";
import { InfoAlert, INFO_ALERT_SEVERITY, INFO_ALERT_TEXT } from "../../components/InfoAlert";
import { getAllSupervisors, createSupervisor, deleteSupervisor, setSupervisor } from '../../proxy';

class Supervisors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supervisors: [],
      isInfoAlertShown: false,
    };
    this.infoAlertSeverity = '';
    this.infoAlertText = '';
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
    this.showInfoAlert('add');
  };

  handleUpdate = async newData => {
    await setSupervisor(newData);
    let tmpSupervisors = this.state.supervisors;
    tmpSupervisors = tmpSupervisors.filter(_ => _.supervisorID !== newData.supervisorID);
    tmpSupervisors.push(newData);
    this.setState({ supervisors: tmpSupervisors });
    this.showInfoAlert('update');
  };

  handleDelete = async oldData => {
    const supervisorID = oldData.supervisorID;
    await deleteSupervisor({ supervisorID });
    let tmpSupervisors = this.state.supervisors;
    tmpSupervisors = tmpSupervisors.filter(_ => _.supervisorID !== oldData.supervisorID);
    this.setState({ supervisors: tmpSupervisors });
    this.showInfoAlert('delete');
  };

  showInfoAlert = type => {
    this.infoAlertSeverity = INFO_ALERT_SEVERITY[type];
    this.infoAlertText = INFO_ALERT_TEXT[type];
    this.setState({ isInfoAlertShown: true });
  };

  handleCloseInfoAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      isInfoAlertShown: false,
    });
  };

  render() {
    const { t } = this.props;
    const { supervisors, isInfoAlertShown } = this.state;
    const columns = [
      { title: t('supervisors.table.id'), field: 'supervisorID' },
      { title: t('supervisors.table.name'), field: 'name' },
      { title: t('supervisors.table.phone'), field: 'phone' },
      { title: t('supervisors.table.email'), field: 'email' },
    ];
    return (
      <div>
        <InfoAlert
          isOpen={isInfoAlertShown}
          onClose={this.handleCloseInfoAlert}
          severity={this.infoAlertSeverity}
          text={this.infoAlertText}
        />
        <Table
          title={t('supervisors.title')}
          columns={columns}
          data={supervisors}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
          handleDelete={this.handleDelete}
          paging={true}
          addable={true}
          updateable={true}
          deleteable={true}
        />
      </div>
    );
  }
}

export default withTranslation()(Supervisors);
