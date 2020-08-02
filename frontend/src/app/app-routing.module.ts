import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportComponent } from './import/import.component';
import { CircuitComponent } from './circuit/circuit.component';
import { ExportComponent } from './export/export.component';
import { ConvertComponent } from './convert/convert.component';
import { StepperComponent } from './stepper/stepper.component';


const routes: Routes = [
  { path: 'import', component: ImportComponent },
  { path: 'circuit', component: CircuitComponent },
  { path: 'export', component: ExportComponent },
  { path: 'convert', component: ConvertComponent },
  { path: 'stepper', component: StepperComponent },
  { path: '**', redirectTo: '/stepper' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
