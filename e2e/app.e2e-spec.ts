import { JslibtestPage } from './app.po';

describe('jslibtest App', () => {
  let page: JslibtestPage;

  beforeEach(() => {
    page = new JslibtestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
