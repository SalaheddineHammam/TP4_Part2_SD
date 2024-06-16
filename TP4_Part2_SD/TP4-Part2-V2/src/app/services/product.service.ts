// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private host: string = "http://localhost:3000";  // Ensure this matches your json-server port

  constructor(private http: HttpClient) {}

  public searchProducts(keyword : string="",page : number=1,size : number=3){
    return this.http.get(`${this.host}/products?name_like=${keyword}&_page=${page}&_limit=${size}`,{observe:'response'});
  }

  public checkProduct(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.host}/products/${product.id}`, {
      checked: !product.checked
    });
  }

  public deleteProduct(product: Product): Observable<any> {
    return this.http.delete<any>(`${this.host}/products/${product.id}`);
  }

  public saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.host}/products`, product);
  }

  // public searchProducts(keyword: string, page: number, size: number): Observable<Array<Product>> {
  //   const url = `${this.host}/products?name_like=${keyword}&_page=${page}&_limit=${size}`;
  //   return this.http.get<Array<Product>>(url);
  // }
  getProductById(productId: number):Observable<Product> {
    return  this.http.get<Product>(`${this.host}/products/${productId}`)

  }

  updateProduct(product: Product):Observable<Product> {
    return this.http.put<Product>(`${this.host}/products/${product.id}`,product)

  }
}
