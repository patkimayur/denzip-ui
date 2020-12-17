import { Injectable } from '@angular/core';
import { RestClientService } from './rest-client.service';
import { HttpParams } from '@angular/common/http';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RazorpayOrder } from '../models/RazorpayOrder';
import { Observable } from 'rxjs';

@Injectable()
export class RazorpayService {

  private static GET_RAZORPAY_ORDER = 'getRazorpayOrder';
  private static UPDATE_RAZORPAY_ORDER_STATUS = 'updateRazorpayOrderStatus';
  private static REPORT_RENTED_OUT = 'reportRentedOut';


  constructor(private restClientService: RestClientService) { }

  public getRazorpayOrder(listingId: string, userId: string, amount: string): Observable<RazorpayOrder> {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    body = body.set('userId', userId);
    body = body.set('amount', amount);
    return this.restClientService.executePostCall<RazorpayOrder>(SERVER_BASE_PATH + RazorpayService.GET_RAZORPAY_ORDER, body);
  }

  public updateRazorpayOrderStatus(razorpayOrderId: string, razorpayPaymentId: string) {
    let body = new HttpParams();
    body = body.set('razorpayOrderId', razorpayOrderId);
    body = body.set('razorpayPaymentId', razorpayPaymentId);
    return this.restClientService.executePostCall<boolean>(SERVER_BASE_PATH + RazorpayService.UPDATE_RAZORPAY_ORDER_STATUS, body);

  }

  public reportRentedOut(listingId: string, userId: string): Observable<boolean> {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    body = body.set('userId', userId);
    return this.restClientService.executePostCall<boolean>(SERVER_BASE_PATH + RazorpayService.REPORT_RENTED_OUT, body);
  }
}
