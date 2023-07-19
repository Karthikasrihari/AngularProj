/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileUploadServiceService } from './FileUploadService.service';

describe('Service: FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileUploadServiceService]
    });
  });

  it('should ...', inject([FileUploadServiceService], (service: FileUploadServiceService) => {
    expect(service).toBeTruthy();
  }));
});
