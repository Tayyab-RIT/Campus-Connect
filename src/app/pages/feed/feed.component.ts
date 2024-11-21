import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  page: number = 1;
  filter: string | null = null;

  constructor(private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    // Listen to route parameter and query parameter changes
    this.route.params.subscribe((params) => {
      this.page = +params['page']; // Get the page number
      this.loadFeed();
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.filter = queryParams['filter']; // Get the filter value
      this.loadFeed();
    });
  }

  async loadFeed() {
    this.isLoading = true;
    this.filter = this.filter || null; // Set filter to null if it's undefined

    this.auth.getFeed(this.page, this.filter).subscribe({
      next: (feed) => {
        this.auth.getUser().subscribe({
          next: (user) => {
            const userId = user.data.id;

            // Map posts and calculate `likedByUser`
            this.posts = feed.data.map((post: any) => ({
              ...post,
              likedByUser: post.like?.some(
                (like: { user_id: string }) => like.user_id === userId
              ),
            }));
            console.log('Feed fetched successfully:', this.posts);
          },
          error: (error) => {
            console.error('Error fetching user ID:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching feed:', error);
        this.errorMessage =
          error.error?.message ||
          'Failed to load feed. Please try again later.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  toggleLike(postId: string) {
    this.auth.getUser().subscribe({
      next: (user) => {
        const userId = user.data.id;
        const post = this.posts.find((p) => p.id === postId);
        if (!post) return;

        if (post.likedByUser) {
          // User has already liked the post, remove like
          this.auth.removeLike(postId).subscribe({
            next: () => {
              post.likedByUser = false; // Update the likedByUser property immediately
              post.like = post.like.filter(
                (like: { user_id: any }) => like.user_id !== userId
              ); // Remove the like
              console.log(`Like removed for post ${postId}`);
            },
            error: (error) => {
              console.error('Error removing like:', error);
            },
          });
        } else {
          // User hasn't liked the post yet, add like
          this.auth.addLike(postId).subscribe({
            next: (newLike) => {
              post.likedByUser = true; // Update the likedByUser property immediately
              post.like = [...post.like, { user_id: userId }]; // Add the new like to the likes array
              console.log(`Like added for post ${postId}`);
            },
            error: (error) => {
              console.error('Error adding like:', error);
            },
          });
        }
      },
      error: (error) => {
        console.error('Error fetching user ID:', error);
      },
    });
  }

  hasUserLiked(post: any): boolean {
    console.log('HERE');

    this.auth.getUser().subscribe({
      next: (user) => {
        const userId = user.data.id;
        return post.like?.some(
          (like: { user_id: any }) => like.user_id === userId
        );
      },
      error: (error) => {
        console.error('Error fetching user ID:', error);
      },
    });
    return false;
  }

  addComment(post: any, comment: string) {
    return null; // Implement this method
  }
}
