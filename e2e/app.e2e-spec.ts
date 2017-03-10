import { ReusableUiPage } from './app.po';

describe('reusable-ui App', function() {
  let page: ReusableUiPage;

  beforeEach(() => {
    page = new ReusableUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
