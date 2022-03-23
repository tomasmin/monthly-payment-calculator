import { newE2EPage } from '@stencil/core/testing';

describe('klix-credit-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<klix-credit-badge></klix-credit-badge>');

    const element = await page.find('klix-credit-badge');
    expect(element).toHaveClass('hydrated');
  });
});
