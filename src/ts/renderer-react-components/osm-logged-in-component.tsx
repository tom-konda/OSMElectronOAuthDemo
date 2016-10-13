import * as React from 'react';

export default class OSMLoggedInComponent extends React.Component<AppComponentProps, void> {
  constructor (props:any) {
    super(props);
  }
  private handleLogoutClick() {
    const logoutButtonClickEvent = new CustomEvent('logoutButtonClicked');
    window.dispatchEvent(logoutButtonClickEvent);
  }
  render() {
    return (
      <input type="button" value="ログアウト" onClick={this.handleLogoutClick} />
    )
  }
}