import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
baseURL = "https://apigw.mweb.co.za/prod/baas/proxy/marketing/products/promos/FTTH-OCTOTEL-SETUP-50MBDWN,FTTH-FROG-M2M-SETUP-CLAWBACK-50MBDWN,FTTH-CCC-SETUP-50MBDWN,FTTH-MFN-SETUP-CLAWBACK-50MBDWN,FTTH-LINKAFRICA-SETUP-CLAWBACK-50MBDWN,FTTH-LIGHTSTRUCK-SETUP-CLAWBACK-50MBDWN,FTTH-VUMA-CLAWBACK-50MBDWN,FTTH-OCTOTEL-SETUP-100MBUP,FTTH-CCC-SETUP-100MBUP,FTTH-VUMA-CLAWBACK-100MBUP,FTTH-LINKAFRICA-SETUP-CLAWBACK-100MBUP,FTTH-FROG-M2M-SETUP-CLAWBACK-100MBUP,FTTH-MFN-SETUP-CLAWBACK-100MBUP,FTTH-LIGHTSTRUCK-SETUP-CLAWBACK-100MBUP,FTTH-OPEN-SETUP-CLAWBACK-50MBDWN-NEW,FTTH-OPEN-SETUP-CLAWBACK-100MBUP-NEW,FTTH-EVOTEL-CLAWBACK-50MBDWN,FTTH-EVOTEL-CLAWBACK-100MBUP,FTTH-LINKLAYER-CLAWBACK-50MBDWN,FTTH-LINKLAYER-CLAWBACK-100MBUP,FTTH-VODA-CLAWBACK-100MBUP,FTTH-VODA-CLAWBACK-50MBDWN-NEW?sellable_online=true"

  constructor(public http: HttpClient) { }


  getCampaigns():Observable<any>{
    return this.http.get("https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public");
  }

  getPromos():Observable<any>{
    return this.http.get("https://apigw.mweb.co.za/prod/baas/proxy/marketing/products/promos/FTTH-MITCHELLS-PREPAID-AMBER,VUMA-REACH-RECURRING,VUMA-REACH-28DAY-SERVICE,VUMA-REACH-28DAY-SERVICE-40MBPS?sellable_online=true");
  }

  getPromocode():Observable<any>{
    return this.http.get(`${this.baseURL}/marketing/products/promos`);
  }
}
