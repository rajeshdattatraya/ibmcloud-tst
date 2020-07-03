import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from './../model/appConfig';
import { UserResult} from './../model/userResult';

//var passport = require('passport');
@Injectable({
  providedIn: 'root'
})

export class ApiService {

  baseUri:string = appConfig.baseUri + '/api';
  userResultUri:string = appConfig.baseUri + '/result';
  baseloginUri:string = appConfig.baseUri + '/api/login';
  baseBandUri:string = appConfig.baseUri + '/api/band';
  baseJrssUri:string = appConfig.baseUri + '/api/jrss';
  basePreTechQuestionnaireUri:string = appConfig.baseUri + '/api/preTechForm/getPreTechQuestionanire';
  baseQuestionUri:string = appConfig.baseUri +'/api/quiz';
  projectAllocUri:string = appConfig.baseUri + '/projectAlloc';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  baseUserroleUri:string = appConfig.baseUri + '/api/userrole';
  techStreamUri:string = appConfig.baseUri + '/techStream';

  constructor(private http: HttpClient) { }
// Get all JRSS
getJRSS() {
  return this.http.get(`${this.baseJrssUri}`);
  }

// http://localhost:4000/api/preTechForm/getPreTechQuestionanire/Java%20Technical%20Assessment/candidate12@ibm.com
getpreTechQuestions(jrss) {
  let url = `${this.basePreTechQuestionnaireUri}/${jrss}/admin`;
  console.log("the url is "+ url);
  return this.http.get(`${this.basePreTechQuestionnaireUri}/${jrss}/admin`);
}
 
// Get all JRSS
getJRSSPreTech(jrssName) {
  let url = `${this.baseJrssUri}/getJrssPreTech/${jrssName}`;
  console.log("the url 2 is "+ url);
  return this.http.get(`${this.baseJrssUri}/getJrssPreTech/${jrssName}`);
}
// Create Candidate
  createCandidate(data): Observable<any> {
    let url = `${this.baseUri}/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  // Get Users table records based on username
getPreTechniaclQuestions(jrss,userName): Observable<any> {
  let url = `${this.baseQuestionUri}/getPreTechQuestionanire/${jrss}/${userName}`;

  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
  )
  }

  // GET Candidate JRSS
  getCandidateJrss(username): Observable<any> {
    let url = `${this.baseUri}/candidatejrss/${username}`;
    return this.http.get(url)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // GET Candidate details by username
  getCandidateDetails(username): Observable<any> {
      let url = `${this.baseUri}/readCandidate/${username}`;
      return this.http.get(url, {headers: this.headers}).pipe(
            map((res: Response) => {
              return res || {}
            }),
            catchError(this.errorMgmt)
      )
  }

  // Create Question
  createQuestion(data): Observable<any> {
    console.log('create question apiservice');
    let url = `${this.baseUri}/createquestion`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

    // get max Question
    getQuestionID(): Observable<any> {
      console.log('get question ID apiservice');
      let url = `${this.baseUri}/getMaxQuestionID`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
        )
    }
  // Create User Details
  createUserDetails(data): Observable<any> {
    let url = `${this.baseUri}/createUser`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Create user
  createUser(data): Observable<any> {

    let url = `${this.baseloginUri}/login`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )

  }

  // Get all candidates
  getCandidates() {
    return this.http.get(`${this.baseUri}`);
  }

  // Get candidate
  getCandidate(id): Observable<any> {
    let url = `${this.baseUri}/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Get User Details by ID
  getUser(id): Observable<any> {
    let url = `${this.baseUri}/readUser/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Get Unique Username
  findUniqueUsername(email): Observable<any> {
    let url = `${this.baseUri}/findUser/${email}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
      )
  }


 // Get User
 getUserByIdAndPwd(id, pwd): Observable<any> {
  let url = `${this.baseloginUri}/readUser/${id}/${pwd}`;
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
  )
}

 // Get User by Username and DateOfJoining
 getUserByIdAndDOJ(id, doj): Observable<any> {
  let url = `${this.baseloginUri}/getUserDOJ/${id}/${doj}`;
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
  )
}

// Get Users table records based on username
getUserByUserName(id): Observable<any> {
  let url = `${this.baseloginUri}/getUser/${id}`;
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
    )
  }

  // Update Users table status,quizNumber,UpdatedBy and UpdatedDate columns based on candidate table username
  updateUsersStatusAndQuizNum(id,quiznum,status,uname): Observable<any> {
    let url = `${this.baseloginUri}/updateUserStatusAndQuizNum/${id}/${quiznum}/${status}/${uname}`;
    return this.http.put(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
    )
  }

// Update Users table status,UpdatedBy and UpdatedDate columns based on candidate table username
  updateUsersStatus(id,status,uname): Observable<any> {
    let url = `${this.baseloginUri}/updateUserStatus/${id}/${status}/${uname}`;
    return this.http.put(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
    )
  }

 // Update password
 updatepassword(id, pwd): Observable<any> {
     let url = `${this.baseloginUri}/updatepassword/${id}/${pwd}`;
  return this.http.put(url, pwd).pipe(
    catchError(this.errorMgmt)
  )
}
  // Update candidate
  updateCandidate(id, data): Observable<any> {
    let url = `${this.baseUri}/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  //Update Candidate Resume from Pre-Tech Form.
  updateCandidateResume(username, data): Observable<any> {
    let url = `${this.baseUri}/updateCandidateResume/${username}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

   // Update User by ID
   updateUserDetails(id, data): Observable<any> {
    let url = `${this.baseUri}/updateUser/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete candidate and user
  deleteCandidate(id,username): Observable<any> {
    let url = `${this.baseUri}/delete/${id}/${username}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Create band
    createBand(data): Observable<any> {
      let url = `${this.baseBandUri}/createBand`;
      return this.http.post(url, data)
        .pipe(
          catchError(this.errorMgmt)
        )
    }

    // Get all bands
    getBands() {
      return this.http.get(`${this.baseBandUri}`);
    }

    // Get band
    getBand(id): Observable<any> {
      let url = `${this.baseBandUri}/readBand/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
    }

    // Update band
    updateBand(id, data): Observable<any> {
      let url = `${this.baseBandUri}/updateBand/${id}`;
      return this.http.put(url, data, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      )
    }

    // Delete band
    deleteBand(id): Observable<any> {
      let url = `${this.baseBandUri}/deleteBand/${id}`;
      return this.http.delete(url, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      )
    }


  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // Update userLoggedin status.
 updateUserLoggedinStatus(username, userloggedin): Observable<any> {
  let url = `${this.baseloginUri}/${username}/${userloggedin}`;
return this.http.put(url, status).pipe(
 catchError(this.errorMgmt)
)
}


//Start JRSS:

// Create jrss
createJrss(data): Observable<any> {
  let url = `${this.baseJrssUri}/createJrss`;
  return this.http.post(url, data)
    .pipe(
      catchError(this.errorMgmt)
    )
}

// Get all jrss
getJrsss() {
  return this.http.get(`${this.baseJrssUri}`);
}

// Get jrss by id
getJrssById(id): Observable<any> {
  let url = `${this.baseJrssUri}/readJrssById/${id}`;
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
  )
}

// Get jrss
getJrss(id): Observable<any> {
  let url = `${this.baseJrssUri}/readJrss/${id}`;
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
  )
}

// Delete jrss
deleteJrss(id): Observable<any> {
  let url = `${this.baseJrssUri}/deleteJrss/${id}`;
  return this.http.delete(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}
//End of JRSS:

// Update technology stream by ID
 updateTechStream(id, data): Observable<any> {
  let url = `${this.baseJrssUri}/updateTechStream/${id}`;
  return this.http.put(url, data, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}
// Update Workflow by JRSS name
 updateWorkflow(id, data): Observable<any> {
  let url = `${this.baseJrssUri}/updateWorkflow/${id}`;
  return this.http.put(url, data, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}


/**
 *
 * getCandidateAssessmentDetails
 * @param username
 * @author A.George
 * 29May2020
 *
 */
getCandidateAssessmentDetails(username,quizNumber): Observable<any> {
  let url = `${this.userResultUri}/quizDetailsByUser/${username}/${quizNumber}`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

//getDashboardList
getDashboardList(): Observable<any> {
  let url = `${this.userResultUri}/getDashboardList`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

//viewDashboardDetails
viewDashboardDetails(id): Observable<any> {
  let url = `${this.userResultUri}/viewDashboardDetails/${id}`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

//getPartnerInterviewList
getPartnerInterviewList(): Observable<any> {
  let url = `${this.userResultUri}/getPartnerInterviewList`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

//readPartnerInterviewDetails
readPartnerInterviewDetails(userName): Observable<any> {
  let url = `${this.userResultUri}/readPartnerInterviewDetails/${userName}`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

//savePartnerFeedBack
  savePartnerFeedBack(id,data): Observable<any> {
  console.log('savePartnerFeedBack API update method',data);
    let url = `${this.userResultUri}/updatePartnerDetails/${id}`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  //get Operations Candidate List
  getOperationsCandidateList(): Observable<any> {
  let url = `${this.userResultUri}/getOperationsCandidateList`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

//read operations project Details
readOperationsProjectDetails(userName): Observable<any> {
  let url = `${this.userResultUri}/readOperationsProjectDetails/${userName}`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

//Insert Operations project Details
insertOperationsDetails(data): Observable<any> {
  let url = `${this.projectAllocUri}/insertOperatioDetails`;
  return this.http.post(url, data)
    .pipe(
      catchError(this.errorMgmt)
    )
}

//saveOperationsStatus
saveOperationsStatus(id, status): Observable<any> {
  let url = `${this.userResultUri}/updateOperationsStatus/${id}`;
    return this.http.post(url, status)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

//getTechnicalInterviewList
getTechnicalInterviewList(): Observable<any> {
  let url = `${this.userResultUri}/getTechnicalInterviewList`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

getResultByUser(username: string,quiznumber:number){
  let url = `${this.userResultUri}/getResultByUser/${username}/${quiznumber}`;
  return this.http.get(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}

// Update candidate
updateResults(id: string,data: UserResult): Observable<any> {
  let url = `${this.userResultUri}/updateResults/${id}`;
  return this.http.put(url, data, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}


// Update candidate
updateExceptionalApproval(id: string,quizNumber,smeFeedback): Observable<any> {
  let url = `${this.userResultUri}/updateExceptionalApproval/${id}/${quizNumber}/${smeFeedback}`;
  return this.http.put(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}

// Update candidate
updateExceptionalApprovalForStage4(data,id,quizNumber): Observable<any> {
  let url = `${this.userResultUri}/updateExceptionalApprovalStage4/${id}/${quizNumber}`;
  return this.http.put(url, data, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}

readTechInterviewDetails(userName,quizId): Observable<any> {
  let url = `${this.userResultUri}/readCandidateTechSMEReviewDetails/${userName}/${quizId}`;
  return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
  )
}

// Get all userroles
getUserroles() {
  return this.http.get(`${this.baseUserroleUri}`);
}


//Check if any user already present with the same email id in Users table
findUniqueUserEmail(email): Observable<any> {
  let url = `${this.baseUserroleUri}/findUser/${email}`;
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
    )
}


//getAllSpecialUsers

//Check if any user already present with the same email id in Users table
findAllUser(): Observable<any> {
  let url = `${this.baseUserroleUri}/findAllUser`;
  return this.http.get(url, {headers: this.headers}).pipe(
    map((res: Response) => {
      return res || {}
    }),
    catchError(this.errorMgmt)
    )
}


// Delete a user
deleteUser(username): Observable<any> {
  let url = `${this.baseUserroleUri}/deleteUser/${username}`;
  return this.http.delete(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}

// Get all techStream
getTechStream() {
  return this.http.get(`${this.techStreamUri}`);
}

// Create techStream
createTechStream(data): Observable<any> {
  let url = `${this.techStreamUri}/createTechStream`;
  return this.http.post(url, data)
    .pipe(
      catchError(this.errorMgmt)
    )
}


}
