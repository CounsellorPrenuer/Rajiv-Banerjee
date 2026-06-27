import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCms } from "@/hooks/useCms";
import { imageUrl } from "@/lib/sanity";

export default function BlogSection() {
  const { data } = useCms();
  const blogPosts = data?.blogPosts ?? [];

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" data-testid="blog-section">
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
          {blogPosts.slice(0, 3).map((post, index) => (
            <article
              key={post._id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`blog-post-${index}`}
            >
              <img
                src={post.image ? imageUrl(post.image, 400) : "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=200&fit=crop"}
                alt={post.image?.alt || post.title}
                className="w-full h-48 object-cover"
                data-testid={`img-blog-post-${index}`}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid={`text-title-${index}`}>
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4" data-testid={`text-excerpt-${index}`}>
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground" data-testid={`text-date-${index}`}>
                    {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                  </span>
                  <Link href={`/blog/${post.slug}`} className="text-primary font-medium hover:underline" data-testid={`button-read-more-${index}`}>
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300" data-testid="button-view-all-articles">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
