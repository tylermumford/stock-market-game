import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserMessageService {

  alert(message: string) {
    window.alert(message)
  }
}
