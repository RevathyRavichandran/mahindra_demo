import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MilestoneComponent } from './milestone/milestone.component';
import { AllTicketsComponent } from './all-tickets/all-tickets.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ManageEnterpriseComponent } from './manage-enterprise.component';
import { ActivityComponent } from './activity/activity.component';
import { AppointmentComponent }  from './appointment/appointment.component';
import { RegionComponent } from 'src/app/matrix/region/region.component';

const routes: Routes = [

  {
    path: '',
    component: ManageEnterpriseComponent,
    children: [
      {
        path: 'OnePager-Report',
        component: VisitorsComponent
      },
      {
        path: 'Market-Updates',
        component: FeedbackComponent
      },
      {
        path: 'Product-Information',
        component: AllTicketsComponent
      },
      {
        path: 'Digital-Factsheet',
        component: MilestoneComponent
      },
      {
        path: 'Product-Notes',
        component: ActivityComponent
      },
      {
       path: 'Corporate-Deck' ,
       component: AppointmentComponent
      },
      {
        path: 'metrix/region' ,
        component: RegionComponent
       }
    ]
  }

  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEnterpriseRoutingModule { }
