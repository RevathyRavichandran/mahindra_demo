import { Component, OnInit } from '@angular/core';
import { EnterpriseApiService } from '@services/enterprise-api.service';
import { ToasterService } from '@services/toaster.service';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'app-retailer-status',
  templateUrl: './retailer-status.component.html',
  styleUrls: ['./retailer-status.component.css']
})


export class RetailerStatusComponent implements OnInit {

  retailerStatus : {
    feedbackCount: any,
    ticketCount: any,
    visitorCount: any
  };

  constructor(
    private enterpriseApiService: EnterpriseApiService,
    private adminService: AdminService,
    private toaster: ToasterService
  ) { }

  ngOnInit(): void {
    this.getRetailerStatus();
  }

  

  async getRetailerStatus() {
    const response: any = {
      "ApplicationId" : "603dcdb6dbeb11ec84380022480d6e6c",
      "Error" : "0",
      "ErrorCode" : "",
      "ErrorMessage" : "",
      "ProcessId" : "93d5b544519911ecb58f0022480d6e6c",
      "ProcessInstanceId" : "01d4562a3b1b11edbe9e0242ac110002",
      "ProcessName" : "VPS Count API",
      "ProcessVariables" : {
         "appointmentCount" : 77364,
         "appointmentQuery" : "SELECT COUNT(id) AS appointment_count FROM vps_appointment_booking_report WHERE is_active = 1",
         "appointmentRating" : 47,
         "ccDate" : "",
         "errorCode" : "200",
         "errorMessage" : "Count Response",
         "errorStatus" : "S",
         "feedbackCount" : 29284,
         "liveAgentCount" : 37785,
         "test1" : "",
         "totalAppointment" : 77364,
         "totalVisitor" : 164223,
         "visitorQuery" : "SELECT COUNT(id) AS visitor_count FROM vps_user_monitor WHERE is_active = 1"
      },
      "Status" : "Execution Completed",
      "WorkflowId" : "628dbe44d8299cd2b49dd676",
      "currentCorrelationId" : "281475477336294",
      "customizedLogId" : "",
      "endedOn" : "2022-09-23T08:37:50.093934",
      "isWaitingForEvent" : false,
      "nodeBPMNId" : "2",
      "processId" : "93d5b544519911ecb58f0022480d6e6c",
      "processName" : "VPS Count API",
      "repoId" : "603dcdb6dbeb11ec84380022480d6e6c",
      "repoName" : "VPS Health_v1",
      "rootCorrelationId" : "281475477336294",
      "startedOn" : "2022-09-23T08:37:49.920538"
   };

    console.log('getRetailerStatus', response);

    const appiyoError = response.Error;
    const apiErrorCode = response.ProcessVariables?.errorCode;
    const errorMessage = response.ProcessVariables?.errorMessage;

    if (appiyoError === '0' && apiErrorCode == '200') {
      const counts = response?.ProcessVariables     
      this.retailerStatus = {
        feedbackCount: counts?.feedbackCount,
        // feedbackCount : 30,
        ticketCount: counts?.appointmentCount,
        visitorCount: counts?.liveAgentCount
      };
    } else {
      if(errorMessage === undefined){
        return;
      }
      this.toaster.showError(errorMessage, 'Feedback Ticket Visitor Count Dashboard API')
    }
  }

}
