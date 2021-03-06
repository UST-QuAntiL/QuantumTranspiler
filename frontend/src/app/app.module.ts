import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputComponent } from './input/input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CodeComponent } from './code/code.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { CircuitComponent } from './circuit/circuit.component';
import { ConvertComponent } from './convert/convert.component';
import { GraphicalComponent } from './graphical/graphical.component';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import { StepperComponent } from './stepper/stepper.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { OutputComponent } from './output/output.component';
import { UnrollComponent } from './unroll/unroll.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {MatListModule} from '@angular/material/list';
import { TabComponent } from './tab/tab.component';
import { SimulateComponent } from './simulate/simulate.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { GateEditComponent } from './gate-edit/gate-edit.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets',
  defaultOptions: { scrollBeyondLastLine: false }
};


@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    CodeComponent,
    ImportComponent,
    ExportComponent,
    CircuitComponent,
    ConvertComponent,
    GraphicalComponent,
    StepperComponent,
    OutputComponent,
    UnrollComponent,
    TabComponent,
    SimulateComponent,
    AnalyzeComponent,
    GateEditComponent,
    BottomSheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    HttpClientModule,
    MatSnackBarModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatCheckboxModule,
    MDBBootstrapModule.forRoot(),
    MatListModule,
    MatBottomSheetModule,
    MatFormFieldModule,

  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
