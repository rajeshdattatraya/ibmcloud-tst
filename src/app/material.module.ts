import { NgModule } from  '@angular/core';
import {MatDatepickerModule} from  '@angular/material/datepicker';
import {MatRadioModule} from  '@angular/material/radio';
import {MatSelectModule} from  '@angular/material/select';
import {MatSliderModule} from  '@angular/material/slider';
import {MatDividerModule} from  '@angular/material/divider';
import {MatTableModule} from  '@angular/material/table';
import {MatTabsModule} from  '@angular/material/tabs';
import {MatCheckboxModule} from  '@angular/material/checkbox';
import {MatToolbarModule} from  '@angular/material/toolbar';
import {MatPaginatorModule} from  '@angular/material/paginator';
import {MatSortModule} from  '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from  '@angular/material/input';
import {MatButtonModule} from  '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';


@NgModule({
imports: [MatCardModule,MatMenuModule,MatSelectModule,MatRadioModule,MatDatepickerModule,MatButtonModule,MatTableModule,MatSortModule,MatTabsModule, MatCheckboxModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatPaginatorModule],
exports: [MatCardModule,MatMenuModule,MatSelectModule,MatRadioModule,MatDatepickerModule,MatButtonModule,MatTableModule,MatSortModule,MatTabsModule, MatCheckboxModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatPaginatorModule],

})

export  class  TATMaterialModule { }
