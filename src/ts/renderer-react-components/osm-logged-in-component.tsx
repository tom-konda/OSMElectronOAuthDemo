import * as React from 'react';
import OSMUserDataComponent from './osm-user-data-component';

export default class OSMLoggedInComponent extends React.Component<AppDefaultComponentProps, void> {
  constructor(props: any) {
    super(props);
  }
  private handleGetUserDataClick() {
    const getUserDataButtonClickEvent = new CustomEvent('getUserDataButtonClicked');
    window.dispatchEvent(getUserDataButtonClickEvent);
  }
  private handleTestChangesetClick() {
    const testChangesetButtonClickEvent = new CustomEvent('testChangesetButtonClicked');
    window.dispatchEvent(testChangesetButtonClickEvent);
  }
  private handleLogoutClick() {
    const logoutButtonClickEvent = new CustomEvent('logoutButtonClicked');
    window.dispatchEvent(logoutButtonClickEvent);
  }
  render() {
    return (
      <section className="main">
        <input type="button" value="OAuth テスト（ユーザデータ取得）" onClick={this.handleGetUserDataClick} />
        <OSMUserDataComponent />
        <input type="button" value="テスト変更セットの作成" onClick={this.handleTestChangesetClick} />
        <input type="button" value="OpenStreetMap からログアウト" onClick={this.handleLogoutClick} />
      </section>
    )
  }
}