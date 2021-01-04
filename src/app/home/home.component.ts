import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CampaignsService } from '../services/campaigns.service';
import  images  from '../providers.json';
import products from '../products.json';
import { HttpClient } from '@angular/common/http';

interface Providers {
    code: String;
    name: String;
    url: String;
}

interface Products {
    productCode: String;
    productName: String;
    productRate: Number;
    provider: String;
    url: String;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: Providers[] = images;
  products: Products[] = products;
  summarizedProducts;
  productPrices;
  prices;

  baseUrl = "https://apigw.mweb.co.za/prod/baas/proxy";
  logoBaseURL = "https://www.mweb.co.za/media/images/providers"
  campaignsURL = "/marketing/campaigns/fibre?channels=120&visibility=public";

  campaigns;
  selectedCampaign;
  productsArr = [];
  filteredProductsArr = [];


  priceRanges = [{min: 0, max: 699, label: 'R0 - R699'}, {min: 700, max: 999, label: 'R700 - R999'}, {min: 1000, max: 9999, label: 'R1000+'}];

  providerInfo = [
    {
      code: 'centurycity',
      name: 'Century City Connect',
      url: `${this.logoBaseURL}/provider-century.png`
    },
    {
      code: 'evotel',
      name: 'Evotel',
      url: `${this.logoBaseURL}/provider-evotel.png`
    },
    {
      code: 'octotel',
      name: 'Octotel',
      url: `${this.logoBaseURL}/provider-octotel.png`
    },
    {
      code: 'vumatel',
      name: 'Vumatel',
      url: `${this.logoBaseURL}/provider-vuma.png`
    },
    {
      code: 'openserve',
      name: 'Openserve',
      url: `${this.logoBaseURL}/provider-openserve.png`
    },
    {
      code: 'frogfoot',
      name: 'Frogfoot',
      url: `${this.logoBaseURL}/provider-frogfoot.png`
    },
    {
      code: 'mfn',
      name: 'MFN',
      url: `${this.logoBaseURL}/provider-metrofibre.png`
    },
    {
      code: 'vodacom',
      name: 'Vodacom',
      url: `${this.logoBaseURL}/provider-vodacom.png`
    },
    {
      code: 'linkafrica',
      name: 'Link Africa',
      url: `${this.logoBaseURL}/provider-linkafrica.png`
    },
    {
      code: 'linklayer',
      name: 'Link Layer',
      url: `${this.logoBaseURL}/provider-link-layer.png`
    },
    {
      code: 'lightstruck',
      name: 'Lightstruck',
      url: `${this.logoBaseURL}/provider-lightstruck.png`
    },
    {
      code: 'mitchells',
      name: 'Mitchells Fibre',
      url: `${this.logoBaseURL}/provider-mitchells.png`
    },
    {
      code: 'vumareach',
      name: 'Vuma Reach',
      url: `${this.logoBaseURL}/provider-vuma.png`
    }
  ];


  constructor(public campaignsService:CampaignsService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllData();
  }


getAllData() {
  this.httpClient.get(`${this.baseUrl}${this.campaignsURL}`)
    .subscribe( campaignsResponse => {

        if (campaignsResponse && campaignsResponse['campaigns']) {
            this.campaigns = campaignsResponse['campaigns'];
            this.getProducts(this.campaigns[0]);
            console.log(this.productsArr);
            this.prices = this.productsArr;
            
        }
      },
      error => {
        this.campaigns = null;
      }
    );
}

getProducts(selectedCampaign) {
  this.productsArr = [];
  this.selectedCampaign = selectedCampaign;

  const promocodes = selectedCampaign.promocodes;
  const promcodeProductsURL = `${this.baseUrl}/marketing/products/promos/${promocodes.join(',')}?sellable_online=true`;

  this.httpClient.get(promcodeProductsURL).subscribe( responseData => {
    for (let response of responseData) {
      for(let product of response.products) {
        const summarizedProduct = this.getSummarizedProduct(product);
        this.productsArr.push(summarizedProduct);
        this.productPrices = summarizedProduct.productRate;
        
      }
    }
  });
  }

  getSummarizedProduct(product) {
    const subcategory = product.subcategory.replace('Uncapped', '').replace('Capped', '').trim();
    return {productCode: product.productCode, productName: product.productName, productRate: product.productRate, provider: subcategory}
  }

  changeCampaign (clickedCampaign) {
    if (clickedCampaign.code !== this.selectedCampaign.code) {
      for(let campaign of this.campaigns) {
        if (campaign.code === clickedCampaign.code) {
          this.selectedCampaign = clickedCampaign;
          this.getProducts(this.selectedCampaign);
          
        }
      }
    }
  }


  filter(provider, min, max) {
    this.filteredProductsArr = [];

    if (min || max) {
    this.filterProductsPrice(min, max);
    }
    if (provider) {
    this.filterProductsProvider(provider);
    }

    for (const product of this.productsArr) {
      if (this.filteredByPriceArr.includes(product) &&  this.filteredByProviderArr.includes(product)) {
        this.filteredProductsArr.push(product);
      }
    }
    

  }

  filterProductsPrice (min, max) {

    this.filteredByPriceArr = [];

    if (!this.priceRangeFilter.includes(min)) {
      this.priceRangeFilter.push(min);
    } else {
      this.priceRangeFilter = this.priceRangeFilter.filter(price => price !== min);
    }

    if (!this.priceRangeFilter.includes(max)) {
      this.priceRangeFilter.push(max);
    } else {
      this.priceRangeFilter = this.priceRangeFilter.filter(price => price !== max);
    }

    this.priceRangeFilter.sort(function(a, b) {
      return a - b;
    });;
    
    for (let product of this.productsArr) {
      if (product.productRate >= this.priceRangeFilter[0] && product.productRate <= this.priceRangeFilter[this.priceRangeFilter.length - 1]) {
        this.filteredByPriceArr.push(product);
      }
    }

    if (this.priceRangeFilter.length <= 0) {
      this.filteredProductsArr = this.productsArr;
    }

  }

  filterProductsProvider (provider) {
    this.providerFilter = [];

    if (!this.providerFilter.includes(provider)) {
      this.providerFilter.push(provider);
    } else {
      this.providerFilter = this.providerFilter.filter(providerItem => providerItem !== provider);
    }

    for (let product of this.productsArr) {
      for (let provider of this.providerFilter) {
        if (product.provider === provider) {
          this.filteredByProviderArr.push(product);
        }
    }

    if (this.providerFilter.length <= 0) {
      this.filteredProductsArr = this.productsArr;
    }
    }


  
  
  }

}
