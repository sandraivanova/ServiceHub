import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {IUser} from "@dnevnica/shared";
import {Observable} from "rxjs";
import { IGivingService,IReview } from '@dnevnica/shared';
@Injectable({
  providedIn: "root",
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:3000/api/auth/login', {email, password})
  }

  logout(refreshToken: string) {
    return this.http.post('http://localhost:3000/api/auth/logout', { refreshToken });
  }

  getCurrentUser() {
    return this.http.get<IUser>('http://localhost:3000/api/users/current-user');
  }

  refreshToken(refreshToken: string) {
    return this.http.post<any>('http://localhost:3000/api/auth/token', { refreshToken });
  }

  getAllGivingServices(filters?: {
    search?: string;
    category?: string;
    location?: string
  }){
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.location) params = params.set('location', filters.location);

    return this.http.get<IGivingService[]>('http://localhost:3000/api/giving-services', {params});
  }

  updateService(id: number | string, serviceData: IGivingService) {
    return this.http.put<IGivingService>(`http://localhost:3000/api/giving-services/${id}`, serviceData);
  }

  deleteService(id: number | string) {
    return this.http.delete(`http://localhost:3000/api/giving-services/${id}`);
  }

  createService(serviceData: IGivingService) {
    return this.http.post<IGivingService>('http://localhost:3000/api/giving-services', serviceData);
  }

  findOne(id: number | string) {
    return this.http.get<IGivingService>(`http://localhost:3000/api/giving-services/${id}`);
  }

  getReviewsForService(serviceId: number) {
    return this.http.get<IReview[]>(`http://localhost:3000/api/review/${serviceId}`);
  }

  createReview(reviewData: IReview) {
    return this.http.post<IReview>('http://localhost:3000/api/review/', reviewData);
  }

  deleteReview(id: number) {
    return this.http.delete(`http://localhost:3000/api/review/${id}`);
  }

  getMyReview(serviceId: number) {
    return this.http.get<IReview>(`http://localhost:3000/api/review/my-review/${serviceId}`);
  }

  updateReview(id: number, reviewData: IReview) {
    return this.http.put<IReview>(`http://localhost:3000/api/review/${id}`, reviewData);
  }
}
