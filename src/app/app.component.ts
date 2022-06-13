import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular_CRUD';
  displayedColumns: string[] = ['productName', 'category','date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api:ApiService){}


  ngOnInit(): void{
    this.getAllProducts()
  }

  //openDialog METHOD
  openDialog() {
    this.dialog.open(DialogComponent, {
     width: '40%'
    }).afterClosed().subscribe(val=> {
      if(val==='save'){
        this.getAllProducts()
      }
    })
  }

  //GET METHOD
  getAllProducts(){
    this.api.getProduct()
    .subscribe({
      next:(res:any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error:(err)=>{
        alert("Error while fetvhing Records")
      }
    })
  }

  editProduct(row:any){
    this.dialog.open(DialogComponent, {
      width: '40%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id: number){
   this.api.deleteProduct(id)
   .subscribe({
    next:()=>{
      alert("Product deleted successfully");
      this.getAllProducts();
    },
    error:()=> {
      alert("Error while deleting the product");
    }
   })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}


