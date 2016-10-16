declare module 'oauth' {
  export class OAuth {
    constructor(
      requestUrl: string,
      accessUrl: string,
      consumerKey: string,
      consumerSecret: string,
      version: '1.0' | '1.0A',
      authorize_callback: string,
      signatureMethod: string,
      nonceSize?: any | undefined,
      customHeaders?: any | undefined
    );
    authHeader(url: any, oauth_token: any, oauth_token_secret: any, method: any): any;
    delete(url: any, oauth_token: any, oauth_token_secret: any, callback: any): any;
    get(url: any, oauth_token: any, oauth_token_secret: any, callback: any): any;
    getOAuthAccessToken(oauth_token: any, oauth_token_secret: any, oauth_verifier: any, callback: (...args: any[]) => any): void;
    getOAuthRequestToken(extraParams: any, callback: (error: null | any, oauth_token: string, oauth_token_secret: string, results: any[]) => any): void;
    getOAuthRequestToken(callback: (error: null | any, oauth_token: string, oauth_token_secret: string, results: any[]) => any): void;
    getProtectedResource(url: any, method: any, oauth_token: any, oauth_token_secret: any, callback: any): void;
    post(url: any, oauth_token: any, oauth_token_secret: any, post_body: any, post_content_type: any, callback: any): any;
    put(url: any, oauth_token: any, oauth_token_secret: any, post_body: any, post_content_type: any, callback: any): any;
    setClientOptions(options: any): void;
    signUrl(url: any, oauth_token: any, oauth_token_secret: any, method: any): any;
  }
  export class OAuth2 {
    constructor(clientId: any, clientSecret: any, baseSite: any, authorizePath: any, accessTokenPath: any, customHeaders: any);
    buildAuthHeader(token: any): any;
    get(url: any, access_token: any, callback: any): void;
    getAuthorizeUrl(params: any): any;
    getOAuthAccessToken(code: any, params: any, callback: any): void;
    getProtectedResource(url: any, access_token: any, callback: any): void;
    setAccessTokenName(name: any): void;
    setAuthMethod(authMethod: any): void;
    useAuthorizationHeaderforGET(useIt: any): void;
  }
  export class OAuthEcho {
    constructor(realm: any, verify_credentials: any, consumerKey: any, consumerSecret: any, version: any, signatureMethod: any, nonceSize: any, customHeaders: any);
    authHeader(url: any, oauth_token: any, oauth_token_secret: any, method: any): any;
    delete(url: any, oauth_token: any, oauth_token_secret: any, callback: any): any;
    get(url: any, oauth_token: any, oauth_token_secret: any, callback: any): any;
    getOAuthAccessToken(oauth_token: any, oauth_token_secret: any, oauth_verifier: any, callback: any): void;
    getOAuthRequestToken(extraParams: any, callback: any): void;
    getProtectedResource(url: any, method: any, oauth_token: any, oauth_token_secret: any, callback: any): void;
    post(url: any, oauth_token: any, oauth_token_secret: any, post_body: any, post_content_type: any, callback: any): any;
    put(url: any, oauth_token: any, oauth_token_secret: any, post_body: any, post_content_type: any, callback: any): any;
    setClientOptions(options: any): void;
    signUrl(url: any, oauth_token: any, oauth_token_secret: any, method: any): any;
  }
}