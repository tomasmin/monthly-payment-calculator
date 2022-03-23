import { newSpecPage, mockFetch } from '@stencil/core/testing';
import { KlixCreditBadge } from '../klix-credit-badge';

const MOCK_RESPONSE = {
  numberOfPayments: 36,
  gracePeriodPaymentCount: 3,
  principalAmount: 349.99,
  monthlySplitPaymentAmount: 116.67,
  downPaymentAmount: 0,
  monthlyPaymentStartingFromAmount: 9.73,
  interestRate: 15.0,
};

const MOCK_RESPONSE_GRACE_PERIOD = {
  numberOfPayments: 36,
  gracePeriodPaymentCount: 3,
  principalAmount: 349.99,
  monthlySplitPaymentAmount: 116.67,
  downPaymentAmount: 0,
  monthlyPaymentStartingFromAmount: 9.73,
  interestRate: 15.0,
  financingProductType: 'GRACE_PERIOD',
};

describe('klix-credit-badge', () => {
  it('renders', async () => {
    mockFetch.json(MOCK_RESPONSE);
    const page = await newSpecPage({
      components: [KlixCreditBadge],
      html: `<klix-credit-badge amount="34999" language="en" b="some-merchant-identifier"></klix-credit-badge>`,
    });
    expect(page.root).toEqualHtml(`
      <klix-credit-badge amount="34999" b="some-merchant-identifier" language="en">
        <mock:shadow-root>
          <div class="container">
            36 payments of €9.73.
          </div>
        </mock:shadow-root>
      </klix-credit-badge>
    `);
  });

  it('renders grace period', async () => {
    mockFetch.json(MOCK_RESPONSE_GRACE_PERIOD);
    const page = await newSpecPage({
      components: [KlixCreditBadge],
      html: `<klix-credit-badge amount="34999" language="en" b="some-merchant-identifier"></klix-credit-badge>`,
    });
    expect(page.root).toEqualHtml(`
      <klix-credit-badge amount="34999" b="some-merchant-identifier" language="en">
        <mock:shadow-root>
          <div class="container">
            3 interest-free payments of €116.67.
          </div>
        </mock:shadow-root>
      </klix-credit-badge>
    `);
  });

  it('renders under 50 EUR', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const page = await newSpecPage({
      components: [KlixCreditBadge],
      html: `<klix-credit-badge amount="300" language="en" b="some-merchant-identifier"></klix-credit-badge>`,
    });
    expect(page.root).toEqualHtml(`
      <klix-credit-badge amount="300" b="some-merchant-identifier" language="en">
        <mock:shadow-root></mock:shadow-root>
      </klix-credit-badge>
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Pay Later is not offered for purchases that are less than 50 EUR.');
  });
});
