import * as React from 'react';

export default class StatusBarComponent extends React.Component<StatusBarComponentProps, AppComponentState> {
  constructor(props: StatusBarComponentProps) {
    super(props);
    this.state = {
      isOAuthReady: this.props.isOAuthReady
    }
  }
  static propTypes: React.ValidationMap<StatusBarComponentProps> = {
    isOAuthReady: React.PropTypes.bool.isRequired,
  }
  componentWillReceiveProps(props: StatusBarComponentProps) {
    this.setState({
      isOAuthReady: props.isOAuthReady
    });
  }
  render() {
    const text = this.state.isOAuthReady ? 'OK' : 'NG';

    return (
      <footer className="statusbar">
        <span>OAuth準備：{text}</span>
      </footer>
    )
  }
}