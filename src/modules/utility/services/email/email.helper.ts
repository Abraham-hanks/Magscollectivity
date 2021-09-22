import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { AuthModel as Auth } from 'src/modules/auth/auth.model';
import { ChangeRequestModel as ChangeRequest } from 'src/modules/change-request/change-request.model';
import { TxtnModel as Txtn } from 'src/modules/txtn/models/txtn.model';
import { EmailObj, EMAIL_QUEUE, formatDateForEmail, formatCurrencyForEmail, SEND_EMAIL } from '../../constants';
import { ProductSubModel as ProductSub } from 'src/modules/product-subscription/product-sub.model';
import { CustomerModel as Customer } from 'src/modules/customer/models/customer.model';
import { PRODUCT_SUB_STATUS } from 'src/modules/product-subscription/constants';
import { DocumentModel as Document } from 'src/modules/document/document.model';

@Injectable()
export class EmailHelper {
  constructor(
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue) { }

  welcome(auth: Auth): boolean {
    const templatePayload = {
      firstname: auth.firstname,
    };

    const newEmail: EmailObj = {
      to: auth.email,
      subject: 'Welcome to Magscollectivity',
      templateName: 'welcome',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);
    return true;
  };

  emailVerifcation(auth: Auth, verification_url: string): boolean {
    const templatePayload = {
      firstname: auth.firstname,
      verification_url
    };

    const newEmail: EmailObj = {
      to: auth.email,
      subject: 'Email Verification',
      templateName: 'gig-email-verification',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };


  newTxtn(txtn: Txtn): boolean {
    // const emailPayload: any = {
    //   merge_name: txtn.customer.name,
    //   merge_amount: new Intl.NumberFormat('en-NG').format(txtn.actual_amount),
    //   merge_charges: new Intl.NumberFormat('en-NG').format(txtn.charges),
    //   merge_desc: txtn.desc,
    //   merge_status: txtn.status,
    //   merge_refrerence: txtn.tx_ref,
    //   merge_bank_name: txtn.meta.bank.bank_name,
    //   merge_account_name: txtn.meta.bank.account_name,
    //   merge_account_number: txtn.meta.bank.account_number,
    //   merge_date: moment(txtn.created_at).format(DATE_TIME_FORMAT),
    //   merge_prev_bal: new Intl.NumberFormat('en-NG').format(txtn.old_bal),
    //   merge_total_bal: new Intl.NumberFormat('en-NG').format(txtn.new_bal),
    // };

    // addEmailToQueue({
    //   to: txtn.customer.email,
    //   subject: 'Bank Transfer',
    //   templateId: '21623',
    //   templatePayload: emailPayload,
    // });

    // this.emailQueue.add(NEW_TXTN_JOB, newTxtn);

    return true;
  };

  forgotPassword(auth: Auth, call_back_url: string): boolean {
    const templatePayload = {
      firstname: auth.firstname,
      call_back_url
    };

    const newEmail: EmailObj = {
      to: auth.email,
      subject: 'Account Password Reset',
      templateName: 'gig-forgot-password',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };

  changeRequest(changeReq: ChangeRequest, login_url?: string): boolean {
    const templatePayload = {
      name: changeReq.customer.firstname,
      login_url,
      changeReq_status: `${changeReq.status}`.toLowerCase(),
      changeReq_type: changeReq.type === "OTHER" ? `` : `${changeReq.type}`.split('_').join(' ').toLowerCase(),
      // property_name: changeReq.product.name,
      // property_address: changeReq.product.address || `unknown address`,
    };

    const newEmail: EmailObj = {
      to: changeReq.customer.email,
      subject: `Change Request Update`,
      templateName: 'change-request-notification',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };
  
  productSubNotification(productSub: ProductSub): boolean {
    const templatePayload = {
      firstname: productSub.customer.firstname,
      property_name: productSub.product.name,
      property_address: productSub.product.address ? `at ${productSub.product.address}` : "",
      unit_price: formatCurrencyForEmail(productSub.amount_per_unit),
      units_purchased: productSub.units, 
      discount: productSub.discounted_percentage ? formatCurrencyForEmail(productSub.discounted_price) : '-',
      total_amount: formatCurrencyForEmail(productSub.total_amount),
      payment_plan_type: productSub.is_installment ? 'Installmental payment' : 'Outright payment',
      amount_paid: formatCurrencyForEmail(productSub.amount_paid),
      amount_remaining: formatCurrencyForEmail(productSub.amount_left),
      payment_due: productSub.status === PRODUCT_SUB_STATUS.completed ? '-': formatDateForEmail(productSub.end_date),
    };

    const newEmail: EmailObj = {
      to: productSub.customer.email,
      subject:'', // 'Property Purchase Confirmed',
      templateName: 'gig-product-sub-notification',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };

  productSubReminder(auth: Auth): boolean {
    const templatePayload = {
      firstname: auth.firstname,
      property_name: '', //name of product
      property_address: '',//product address
      due_date: '', //date default charge will be issued
      login_url: '',
    };

    const newEmail: EmailObj = {
      to: auth.email,
      subject: 'New charge on Magscollectivity',
      templateName: 'product-sub-reminder',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };

  chargeNotification(auth: Auth): boolean {
    const templatePayload = {
      firstname: auth.firstname,
      charge_amount: '',
      charge_reason: '',
      login_url: '',
    };

    const newEmail: EmailObj = {
      to: auth.email,
      subject: 'Charge notification',
      templateName: 'charge-notification',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };

  transactionNotification(transaction: Txtn, customer: Customer): boolean {

    const txtnMessage = {
      //Transaction type
      product_payment : 'Purchase payment',
      commission : 'Commission payment',
      product_subscription : 'Purchase payment',
      charge_payment: 'Charge payment',
      funding: 'Wallet funding',
      withdrawal: 'Wallet withdrawal',
      reversal: 'reversal',
      //Transaction status
      success: 'was successful',
      failed: 'failed',
      pending: 'is pending',
      initiated: 'is initiated',
    }

    const templatePayload = {
      firstname: customer.firstname,
      transaction_type: txtnMessage[transaction.type],
      status: txtnMessage[transaction.status],
      amount: formatCurrencyForEmail(transaction.total_amount),
      transaction_reference: transaction.reference,
      transaction_status: transaction.status,
      transaction_date: formatDateForEmail(transaction.updated_at),
    };

    const newEmail: EmailObj = {
      to: customer.email,
      subject: 'Transaction Notification',
      templateName: 'transaction-notification',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };

  commissionNotification(transaction: Txtn, customer: Customer): boolean {

    const txtnMessage = {
      //Transaction type
      product_payment : 'Purchase payment',
      commission : 'Commission payment',
      product_subscription : 'Purchase payment',
      charge_payment: 'Charge payment',
      funding: 'Wallet funding',
      withdrawal: 'Wallet withdrawal',
      reversal: 'reversal',
      //Transaction status
      success: 'was successful',
      failed: 'failed',
      pending: 'is pending',
      initiated: 'is initiated',
    }

    const templatePayload = {
      firstname: customer.firstname,
      transaction_type: txtnMessage[transaction.type],
      status: txtnMessage[transaction.status],
      amount: formatCurrencyForEmail(transaction.total_amount),
      transaction_reference: transaction.reference,
      transaction_status: transaction.status,
      transaction_date: formatDateForEmail(transaction.updated_at),
    };

    const newEmail: EmailObj = {
      to: customer.email,
      subject: 'Transaction Notification',
      templateName: 'gig-transaction-notification',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };

  referralNotification(referrer: Customer, invited_customer_name: string): boolean {

    const templatePayload = {
      firstname: referrer.firstname,
      invited_customer_name,
    };

    const newEmail: EmailObj = {
      to: referrer.email,
      subject: 'Referral Code Used',
      templateName: 'referral-notification',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };

  sendDocument(document: Document, firstname?:string, email?:string): boolean {
    const documentTypeText = {
      OWNERSHIP : "Ownership document",
      RECEIPT : "Payment receipt",
      OTHER : "Document from Magscollectivity Limited"
    }

    const templatePayload = {
      firstname: document.customer ? document.customer.firstname : firstname,
      document_url: document.url,
      document_type: documentTypeText[document.type],
    };

    const newEmail: EmailObj = {
      to: document.customer ? document.customer.email : email,
      subject: 'Magscollectivity Document',
      templateName: 'document-download',
      templatePayload,
    };

    this.emailQueue.add(SEND_EMAIL, newEmail);

    return true;
  };
}

