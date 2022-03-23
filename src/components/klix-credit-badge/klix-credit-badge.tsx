import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'klix-credit-badge',
  styleUrl: 'klix-credit-badge.css',
  shadow: true,
})
export class KlixCreditBadge {
  @Prop() amount: number;
  @Prop() language: string;
  @Prop() b: string;

  @State() numberOfPayments: number;
  @State() gracePeriodPaymentCount: number;
  @State() principalAmount: number;
  @State() monthlySplitPaymentAmount: number;
  @State() downPaymentAmount: number;
  @State() monthlyPaymentStartingFromAmount: number;
  @State() interestRate: number;
  @State() financingProductType: string;
  @State() responseOk: boolean = false;

  componentWillLoad() {
    if (this.amount >= 5000) {
      fetch(`https://api.stage.klix.app/financing/monthly-payment?amount=${this.amount}&language=${this.language}&b=${this.b}`)
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

      // this.responseOk = true;
      // this.numberOfPayments = 36;
      // this.gracePeriodPaymentCount = 3;
      // this.principalAmount = 349.99;
      // this.monthlySplitPaymentAmount = 116.67;
      // this.downPaymentAmount = 0;
      // this.monthlyPaymentStartingFromAmount = 9.73;
      // this.interestRate = 15.0;
      // this.financingProductType = 'GRACE_PERIOD';
    } else {
      // TODO: Do we need to display something if amount < 5000?
      console.log('Pay Later is not offered for purchases that are less than 50 EUR.');
    }
  }

  render() {
    if (this.responseOk) {
      if (this.financingProductType === 'GRACE_PERIOD') {
        return (
          <div class="container">
            <div class="logo">
              <img src="https://klix.app/wp-content/themes/klix/static/img/svg/logo.svg" height="20" alt="klix-logo" />
            </div>
            <div class="text-wrapper">
              <p>
                {this.gracePeriodPaymentCount} interest-free payments of &euro;{this.monthlySplitPaymentAmount}. <button class="link">Learn more</button>
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div class="container">
            <div class="logo">
              <img src="https://klix.app/wp-content/themes/klix/static/img/svg/logo.svg" height="20" alt="klix-logo" />
            </div>
            <div class="text-wrapper">
              <p>
                {this.numberOfPayments} payments of &euro;{this.monthlyPaymentStartingFromAmount}. <button class="link">Learn more</button>
              </p>
            </div>
          </div>
        );
      }
    }
  }
}
