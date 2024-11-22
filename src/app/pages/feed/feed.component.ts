import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  page: number = 1;
  filter: string | null = null;

  // Admin post creation
  isAdmin: boolean = false;
  newPostContent: string = '';
  newPostImage: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.page = +params['page']; // Get the page number
      this.loadFeed();
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.filter = queryParams['filter']; // Get the filter value
      this.loadFeed();
    });

    // Check if the user is an admin
    this.auth.getUser().subscribe({
      next: (user) => {
        this.isAdmin = user.data.is_admin;
      },
      error: (error) => {
        console.error('Error checking admin status:', error);
      },
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

  createPost() {
    if (!this.newPostContent.trim() && !this.newPostImage) {
      alert('Post content or image is required.');
      return;
    }

    // if (this.newPostImage) {
    // Convert the image to Base64
    // const reader = new FileReader();
    // reader.onload = () => {
    //   const base64Image = reader.result as string; // Base64-encoded image
    //   const payload = {
    //     content: this.newPostContent,
    //     image: base64Image, // Attach Base64 image
    //   };

    //   this.sendPostToBackend(payload);
    // };
    // reader.onerror = () => {
    //   alert('Failed to read the image file.');
    // };

    // reader.readAsDataURL(this.newPostImage); // Read image as Base64
    // } else {
    // If no image, just send the content
    const payload = {
      content: this.newPostContent,
      image: this.newPostImage,
    };
    this.sendPostToBackend(payload);
    // }
  }

  sendPostToBackend(payload: { content: string; image: File | null }) {
    this.auth.createPost(payload).subscribe({
      next: () => {
        alert('Post created successfully!');
        this.newPostContent = '';
        this.newPostImage = null;
        this.loadFeed(); // Reload feed to show the new post
      },
      error: (err) => {
        console.error('Error creating post:', err);
        alert('Failed to create post. Please try again.');
      },
    });
  }

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
          this.auth.removeLike(postId).subscribe({
            next: () => {
              post.likedByUser = false;
              post.like = post.like.filter(
                (like: { user_id: any }) => like.user_id !== userId
              );
            },
            error: (error) => {
              console.error('Error removing like:', error);
            },
          });
        } else {
          this.auth.addLike(postId).subscribe({
            next: () => {
              post.likedByUser = true;
              post.like = [...post.like, { user_id: userId }];
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

  addComment(postId: string, commentContent: string) {
    if (!commentContent.trim()) {
      console.error('Comment cannot be empty');
      return;
    }

    this.auth.addComment(postId, commentContent).subscribe({
      next: (newComment) => {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.comment = [
            ...post.comment,
            {
              id: newComment.data.id,
              user_id: newComment.data.user_id,
              content: commentContent,
              created_at: new Date().toISOString(),
            },
          ];
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

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.newPostImage = file;
    }
  }

  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.auth.deletePost(postId).subscribe({
        next: () => {
          alert('Post deleted successfully.');
          this.posts = this.posts.filter((post) => post.id !== postId); // Update the local posts array
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          alert('Failed to delete the post. Please try again.');
        },
      });
    }
  }
}
