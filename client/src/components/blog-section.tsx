import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

export default function BlogSection() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return (
      <section id="blog" className="py-20 bg-muted" data-testid="blog-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              Latest Insights
            </h2>
            <p className="text-xl text-muted-foreground">
              Stay updated with career trends, industry insights, and professional development tips
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <article key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-48 bg-muted"></div>
                <div className="p-6">
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-6 bg-muted rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-muted" data-testid="blog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Latest Insights
          </h2>
          <p className="text-xl text-muted-foreground">
            Stay updated with career trends, industry insights, and professional development tips
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts?.slice(0, 3).map((post, index) => (
            <article 
              key={post.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 scroll-animate" 
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`blog-post-${index}`}
            >
              <img 
                src={post.imageUrl || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                alt={post.title} 
                className="w-full h-48 object-cover"
                data-testid={`img-blog-post-${index}`}
              />
              <div className="p-6">
                <div className="text-sm text-primary font-medium mb-2" data-testid={`text-category-${index}`}>
                  {post.category}
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid={`text-title-${index}`}>
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4" data-testid={`text-excerpt-${index}`}>
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground" data-testid={`text-date-${index}`}>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                  <button 
                    className="text-primary font-medium hover:underline"
                    data-testid={`button-read-more-${index}`}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
            data-testid="button-view-all-articles"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
