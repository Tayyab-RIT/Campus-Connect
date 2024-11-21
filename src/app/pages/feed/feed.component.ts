import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

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
              visibleComments: post.comment.slice(0, 2), // Only show the first two comments initially
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

  // Show more comments for a specific post
  showMoreComments(post: any) {
    const currentLength = post.visibleComments.length;
    const moreComments = post.comment.slice(currentLength, currentLength + 2); // Load 2 more comments
    post.visibleComments = [...post.visibleComments, ...moreComments];
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

  addComment(postId: string, commentContent: string) {
    if (!commentContent.trim()) {
      console.error('Comment cannot be empty');
      return;
    }

    this.auth.addComment(postId, commentContent).subscribe({
      next: (newComment) => {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          console.log('POST COMMENTS IS', post.comment);
          console.log('NEW COMEMNT IS', newComment);

          // Add the new comment to the comments array with the correct structure
          post.comment = [
            ...post.comment,
            {
              id: newComment.data.id, // Use the ID returned by the backend
              user_id: newComment.data.user_id, // Ensure user_id is included
              content: commentContent, // Use the submitted content
              created_at: new Date().toISOString(), // Add the current timestamp
            },
          ];
          console.log(`Comment added to post ${postId}`);
        }
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      },
    });
  }

  onSearch(filter: string) {
    this.router.navigate(['/feed', 1], { queryParams: { filter } });
  }
}
