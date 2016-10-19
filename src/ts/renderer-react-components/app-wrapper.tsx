import * as React from 'react';
import OSMLoggedInComponent from './osm-logged-in-component';
import StatusbarComponent from './statusbar-component';

export default class AppComponent extends React.Component<AppDefaultComponentProps, AppComponentState> {
  constructor() {
    super();
    this.state = {
      isOAuthReady: false,
    }
  }
  componentDidMount() {
    document.body.addEventListener(
      'oauthReady',
      () => {
        this.setState({
          isOAuthReady: true,
        });
      }
    );
    document.body.addEventListener(
      'oauthNotReady',
      () => {
        this.setState({
          isOAuthReady: false,
        });
      }
    );
  }
  componentWillUnmount() {
    document.body.removeEventListener('oauthReady');
    document.body.removeEventListener('oauthNotReady');
  }
  handleOAuthClick() {
    const buttonClickEvent = new CustomEvent('oauthButtonClicked');
    window.dispatchEvent(buttonClickEvent);
  }
  render() {
    const mainComponent = (isOAuthReady: boolean) => {
      if (isOAuthReady) {
        return (
          <OSMLoggedInComponent />
        )
      }
      else {
        return (
          <section className="main">
            <input type="button" value="OAuth開始" onClick={this.handleOAuthClick} />
          </section>
        )
      }
    }
    return (
      <section id="AppComponent">
        {mainComponent(this.state.isOAuthReady)}
        <StatusbarComponent isOAuthReady={this.state.isOAuthReady} />
      </section>
    )
  }
}