"use strict";
// Complex subsystems
class Account {
    constructor(balance) {
        this.balance = balance;
    }
    checkBalance() {
        return this.balance; // Returns the current balance
    }
    withdraw(amount) {
        // Withdraws amount if sufficient balance exists
        if (amount <= this.balance) {
            this.balance -= amount;
            return true; // Withdrawal successful
        }
        return false; // Withdrawal failed
    }
    deposit(amount) {
        // Deposits the amount into the account
        this.balance += amount;
    }
}
// Complex subsystems
class CreditCard {
    constructor(limit) {
        this.limit = limit;
        this.balance = 0;
    }
    charge(amount) {
        // Charges the amount to the credit card if within the limit
        if (amount <= this.limit - this.balance) {
            this.balance += amount;
            return true; // Charge successful
        }
        return false; // Charge failed
    }
    payOff(amount) {
        // Pays off the specified amount on the credit card
        this.balance -= amount;
    }
    checkCreditCardBalance() {
        return this.balance; // Returns the current credit card balance
    }
}
// Facade class
class BankingFacade {
    constructor() {
        this.account = new Account(1000); // Initial account balance
        this.creditCard = new CreditCard(500); // Credit card limit
    }
    makeDeposit(amount) {
        this.account.deposit(amount); // Deposit amount into account
        console.log(`Deposited: ${amount}. New Account Balance: ${this.account.checkBalance()}`);
    }
    makeWithdrawal(amount) {
        // Attempt to withdraw the specified amount
        if (this.account.withdraw(amount)) {
            console.log(`Withdrew: ${amount}. New Account Balance: ${this.account.checkBalance()}`);
        }
        else {
            console.log(`Withdrawal of ${amount} failed. Insufficient funds.`);
        }
    }
    chargeCreditCard(amount) {
        // Attempt to charge the specified amount to the credit card
        if (this.creditCard.charge(amount)) {
            console.log(`Charged: ${amount} to credit card. Current Credit Card Balance: ${this.creditCard.checkCreditCardBalance()}`);
        }
        else {
            console.log(`Charge of ${amount} failed. Credit limit exceeded.`);
        }
    }
    payOffCreditCard(amount) {
        this.creditCard.payOff(amount); // Pay off the specified amount
        console.log(`Paid off: ${amount} from credit card. Remaining Balance: ${this.creditCard.checkCreditCardBalance()}`);
    }
}
// Usage
const bankingFacade = new BankingFacade();
// Performing transactions with actual data
bankingFacade.makeDeposit(200); // Deposited: 200. New Account Balance: 1200
bankingFacade.makeWithdrawal(150); // Withdrew: 150. New Account Balance: 1050
bankingFacade.chargeCreditCard(300); // Charged: 300 to credit card. Current Credit Card Balance: 300
bankingFacade.payOffCreditCard(100); // Paid off: 100 from credit card. Remaining Balance: 200
// Attempting more operations
bankingFacade.makeWithdrawal(1200); // Withdrawal of 1200 failed. Insufficient funds.
bankingFacade.chargeCreditCard(300); // Charge of 300 failed. Credit limit exceeded.
//# sourceMappingURL=bank-facade.js.map