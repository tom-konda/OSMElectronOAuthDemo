import * as React from 'react';

export default class AppComponent extends React.Component<AppComponentProps, AppComponentStates> {
  constructor () {
    super();
    this.state = {
      file : null,
    }
  }
  componentDidMount() {
    document.body.addEventListener(
      'ipcFileLoaded',
      (event) => console.log(event)
    );
  }
  handleOAuthClick() {
    const buttonClickEvent = new CustomEvent('oauthButtonClicked');
    window.dispatchEvent(buttonClickEvent);
  }
  render() {
    return (
      <input type="button" value="OAuth開始" onClick={this.handleOAuthClick} />
    )
  }
}