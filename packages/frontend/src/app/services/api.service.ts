import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {IUser} from "@dnevnica/shared";
import {Observable} from "rxjs";
import { IGivingService } from '@dnevnica/shared';
@Injectable({
  providedIn: "root",
})
export class ApiService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:3000/api/auth/login', {email, password})
  }

  getCurrentUser() {
    return this.http.get<IUser>('http://localhost:3000/api/users/current-user');
  }

  getAll(): Observable<IGivingService[]> {
    return this.http.get<IGivingService[]>('http://localhost:3000/api/giving-services');
  }

  create(serviceData: IGivingService): Observable<IGivingService> {
    return this.http.post<IGivingService>('http://localhost:3000/api/giving-services', serviceData);
  }

  findOne(id: number | string): Observable<IGivingService> {
    return this.http.get<IGivingService>(`http://localhost:3000/api/giving-services/${id}`);
  }
}
