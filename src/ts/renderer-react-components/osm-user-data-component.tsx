import * as React from 'react';

export default class OSMUserDataComponent extends React.Component<AppDefaultComponentProps, OSMUserDataComponentState> {
  constructor(props: AppDefaultComponentProps) {
    super(props);
    this.state = {
      userData: null
    };
  }
  componentDidMount() {
    document.body.addEventListener(
      'receiveUserData',
      (event: CustomEvent) => {
        this.setState({
          userData: event.detail,
        });
      }
    );
  }
  componentWillUnmount() {
    document.body.removeEventListener('receiveUserData');
  }
  render() {
    let userDataContent: JSX.Element[] = null;
    if (this.state.userData !== null) {
      const dom = this.state.userData;
      const userElement = dom.querySelector('user');
      const userLanguageCount = userElement.querySelectorAll('lang').length;

      const labelText: { [key: string]: string } = {
        'id': 'ユーザID',
        'display_name': '表示名',
        'account_created': '作成日',
        'language_count': '優先言語の数',
      }

      const userData: { [key: string]: string | number } = {
        'id': userElement.getAttribute('id'),
        'display_name': userElement.getAttribute('display_name'),
        'account_created': userElement.getAttribute('account_created'),
        'language_count': userLanguageCount,
      }

      userDataContent = [].concat(Object.keys(labelText).map(
        (index) => <div key={index + Date.now()}>{labelText[index]}:{userData[index]}</div>
      ));

    }

    return (
      <section id="result">
        {userDataContent}
      </section>
    )
  }
}