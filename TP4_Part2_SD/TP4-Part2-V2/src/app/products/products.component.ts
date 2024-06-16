// products.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductService, private router : Router, public appState : AppStateService) {}

  ngOnInit() {
    this.searchProducts();
  }

  searchProducts() {
    // this.appState.setProductState({
    //   status : "LOADING"
    // });
    this.productService.searchProducts(this.appState.productsState.keyword,this.appState.productsState.currentPage,this.appState.productsState.pageSize)
      .subscribe({
      next : (resp) => {
        let products=resp.body as Product[];
        let totalProducts:number=parseInt(resp.headers.get('X-Total-Count')!);
        //this.appState.productState.totalProducts=totalProducts;
        let totalPages=
          Math.floor(totalProducts / this.appState.productsState.pageSize);
        if (totalProducts % this.appState.productsState.pageSize != 0){
          ++totalPages;
        }
        this.appState.setProductState({
          products :products,
          totalProducts:totalProducts,
          totalPages:totalPages,
          status:"LOADED"
        })
      },
      error : err => {
        this.appState.setProductState({
          status:"ERROR",
          errorMessage:err
        })
      }
    })
  }

  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next: updatedProduct => {
        product.checked = !product.checked;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  handleDelete(product: Product) {
    if (confirm("Etes vous sure?!")) {
      this.productService.deleteProduct(product).subscribe({
        next: () => {
          this.appState.productsState.products = this.appState.productsState.products.filter((p:any) => p.id !== product.id);
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }

  // searchProducts() {
  //   this.currentPage=1;
  //   this.totalPages=0;
  //   console.log('Searching for:', this.keyword); // Log the keyword
  //   this.productService.searchProducts(this.keyword,this.currentPage,this.pageSize).subscribe({
  //     next: value => {
  //       console.log('Search results:', value); // Log the search results
  //       this.products = value;
  //     },
  //     error: err => {
  //       console.error('Search error:', err);
  //     }
  //   });
  // }

  handleGotoPage(page: number) {
    this.appState.productsState.currentPage=page;
    this.searchProducts();
  }

  handleEdit(product: Product) {
    this.router.navigateByUrl(`/admin/editProduct/${product.id}`)
  }
}
