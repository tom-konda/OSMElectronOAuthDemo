import * as React from 'react';

export default class AppStatusBarComponent extends React.Component<AppComponentProps, AppComponentStates> {
  constructor () {
    super();
    this.state = {
      file : null,
    }
  }
  componentDidMount() {
    window.addEventListener(
      'oauthReady',
      (event) => console.log(event)
    );
  }
  handleOAuthClick() {
    const buttonClickEvent = new CustomEvent('oauthButtonClicked');
    window.dispatchEvent(buttonClickEvent);
  }
  render() {
    return (
      <input type="button" onClick={this.handleOAuthClick} />
    )
  }
}