import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // Update with your Express backend API endpoint
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Registers a new user
   * @param email User's email
   * @param password User's password
   * @returns Observable with user information
   */
  register(fullName: string, email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, { fullName, email, password })
      .pipe(
        tap((response: any) => {
          console.log('User registered:', response);
        })
      );
  }

  /**
   * Logs in the user and stores the authentication token
   * @param email User's email
   * @param password User's password
   * @returns Observable with token and user information
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        const token = response?.data?.session?.access_token;
        if (token) {
          this.token = token;
          localStorage.setItem('token', this.token!); // Persist token in local storage
          console.log('User logged in:', response);
        }
      })
    );
  }

  getProfile(): Observable<any> {
    return this.getProtectedResource(`${this.apiUrl}/profile`).pipe(
      tap((response: any) => {
        console.log('User profile:', response);
      })
    );
  }

  saveProfile(profileData: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/profile`, profileData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response: any) => {
          console.log('Profile saved:', response);
        })
      );
  }

  getUser(): Observable<any> {
    return this.getProtectedResource(`${this.apiUrl}/current-user`).pipe(
      tap((response: any) => {
        console.log('User:', response);
      })
    );
  }

  getProfileByUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${username}`).pipe(
      tap((response: any) => {
        console.log('User profile:', response);
      })
    );
  }

  removeLike(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/like/${postId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addLike(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/like/${postId}`, null, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Logs out the user and clears the token
   */
  logout(): void {
    this.token = null;
    localStorage.removeItem('token'); // Clear token from local storage
    this.router.navigate(['/']); // Redirect to login page
  }

  /**
   * Checks if the user is authenticated by verifying the presence of a token
   * @returns True if authenticated, otherwise false
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Retrieves the current token from local storage
   * @returns The token as a string, or null if not available
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Helper function to attach the token to HTTP requests
   * @param options Optional HTTP headers
   * @returns HttpHeaders with the Authorization header if token is available
   */
  getAuthHeaders(options: any = {}): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...options,
    });

    const token = this.getToken();
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }

  /**
   * Makes an authenticated request with the token attached
   * @param url Endpoint URL
   * @returns Observable with the response data
   */
  getProtectedResource(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  getFeed(page: number, filter: string | null): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/feed?page=${page}&filter=${filter}`)
      .pipe(
        tap((response: any) => {
          console.log('Feed loaded:', response);
        })
      );
  }
  addComment(postId: string, content: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/comment/${postId}`,
        { content },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response: any) => {
          console.log('Comment added:', response);
        })
      );
  }

  getTutorSlots(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tutor/slots`, {
      headers: this.getAuthHeaders(),
    });
  }

  addTutorSlot(slot: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tutor/slots`, slot, {
      headers: this.getAuthHeaders(),
    });
  }

  bookTutorSlot(slotId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/tutor/book`,
      { slot_id: slotId },
      { headers: this.getAuthHeaders() }
    );
  }

  becomeTutor(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/become-tutor`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response: any) => {
          console.log('User is now a tutor:', response);
        })
      );
  }

  /**
   * Create a new post
   * @param postData Post content and image (optional)
   * @returns Observable with the created post data
   */
  createPost(postData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/create-post`, postData, {
        headers: this.getAuthHeaders({
          // Use multipart form-data for file uploads
          Accept: 'application/json',
        }),
      })
      .pipe(
        tap((response: any) => {
          console.log('Post created successfully:', response);
        })
      );
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-post/${postId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
