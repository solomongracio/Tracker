import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: 'expense',
  loadChildren: () => import('./modules/expense/expense.module').then(mod => mod.ExpenseModule)
}, {
  path: '',
  redirectTo: 'expense',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
