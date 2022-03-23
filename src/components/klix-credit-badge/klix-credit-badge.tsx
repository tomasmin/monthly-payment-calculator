import { Component, h, Prop, State } from '@stencil/core';
import { translate } from '../../utils/translations.util';

@Component({
  tag: 'klix-credit-badge',
  styleUrl: 'klix-credit-badge.css',
  shadow: true,
})
export class KlixCreditBadge {
  @Prop() amount: number;
  @Prop() language: string;
  @Prop() b: string;

  numberOfPayments: number;
  gracePeriodPaymentCount: number;
  principalAmount: number;
  monthlySplitPaymentAmount: number;
  downPaymentAmount: number;
  monthlyPaymentStartingFromAmount: number;
  interestRate: number;
  financingProductType: string;
  @State() responseOk: boolean = false;
  learnMoreUrl: string = '//klix.app';

  // Logo should be a local asset but due to Jest being unable to load .svg files
  // without additional configuration, leaving it like this as a placeholder
  logoUrl = 'https://klix.app/wp-content/themes/klix/static/img/svg/logo.svg';

  componentWillLoad() {
    if (this.amount >= 5000) {
      fetch(`https://api.stage.klix.app/financing/monthly-payment?amount=${this.amount}&language=en&b=${this.b}`)
        .then((response: Response) => {
          if (response.ok) {
            this.responseOk = true;
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(response => {
          this.numberOfPayments = response['numberOfPayments'];
          this.gracePeriodPaymentCount = response['gracePeriodPaymentCount'];
          this.principalAmount = response['principalAmount'];
          this.monthlySplitPaymentAmount = response['monthlySplitPaymentAmount'];
          this.downPaymentAmount = response['downPaymentAmount'];
          this.monthlyPaymentStartingFromAmount = response['monthlyPaymentStartingFromAmount'];
          this.interestRate = response['interestRate'];
          this.financingProductType = response['financingProductType'];
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log('Pay Later is not offered for purchases that are less than 50 EUR.');
    }
  }

  render() {
    if (this.responseOk) {
      let text;
      if (this.financingProductType === 'GRACE_PERIOD') {
        text = (
          <span>
            {this.gracePeriodPaymentCount} {translate('textGracePeriod', this.language)} &euro;{this.monthlySplitPaymentAmount}.
          </span>
        );
      } else {
        text = (
          <span>
            {this.numberOfPayments} {translate('text', this.language)} &euro;{this.monthlyPaymentStartingFromAmount}.
          </span>
        );
      }
      return (
        <div class="container">
          <div class="logo">
            <img src={this.logoUrl} height="20" alt="klix-logo" />
          </div>
          <div class="text-wrapper">
            <p>
              {text}{' '}
              <a class="link" href={this.learnMoreUrl} target="_blank">
                {translate('learnMore', this.language)}
              </a>
            </p>
          </div>
        </div>
      );
    }
  }
}
