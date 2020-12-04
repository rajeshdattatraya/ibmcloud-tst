import { Injectable } from '@angular/core';
import { BackupDataService } from './backup-data.service';

/**
 * This class will have various methods required to Re-register a candidate into the system
 */
@Injectable({
    providedIn: 'root'
})
export class ReRegisterCandidate {

    constructor(private backupDataService: BackupDataService) {
    }

    backupCandidateData(username) {
        this.backupDataService.backupCandidateData(username).subscribe(data => {
        })
    }


}

