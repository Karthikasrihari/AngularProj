import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform { transform(value: string):any {
  console.log("ret number "+value);
  let retNumber = Number(value);
 
  return isNaN(retNumber) ? 0 : retNumber;
}
}