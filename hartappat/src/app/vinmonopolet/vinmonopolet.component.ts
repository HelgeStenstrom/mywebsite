import { Component, OnInit } from '@angular/core';
import {ProductDetail, VinmonopoletService} from "../services/vinmonopolet.service";

@Component({
  selector: 'app-vinmonopolet',
  templateUrl: './vinmonopolet.component.html',
  styleUrls: ['./vinmonopolet.component.css']
})
export class VinmonopoletComponent implements OnInit {
  private service: VinmonopoletService;
  products: ProductDetail[] = [];

  constructor(service: VinmonopoletService) {
    this.service = service;
  }

  ngOnInit(): void {
    this.service.getProductDetails()
      .subscribe((ps: ProductDetail[]) => {
        // console.log("VinMono product: ", ps)
        for (const p of ps) {
          this.products.push(p);
        }
      })
  }

}
