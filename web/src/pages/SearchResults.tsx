import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom" // or next/router if using Next.js
import { useForumStore } from "@/stores/ForumStore/forumStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, MessageSquare, Folder, FileText, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { SearchBar } from "@/components/forums/search-bar"

// Define the structure of search results based on your backend response
interface SearchResultItem {
  type: 'Forum' | 'Thread' | 'Post' | 'Comment';
  data: {
    _id: string;
    title?: string;
    content?: string;
    description?: string;
    forum?: string;
    thread?: string;
    post?: string;
    createdAt: Date;
  };
  certainty: number;
}

export function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchForums, searchResult, loading, error } = useForumStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Parse query parameter when component mounts or URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);
  
  // Function to perform the search
  const performSearch = async (query: string) => {
    try {
      await searchForums(query);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };
  
  // Handle search form submission on the results page
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    performSearch(searchQuery.trim());
  };

  const handleItemClick = (item: SearchResultItem) => {
    switch (item.type) {
      case 'Forum':
        navigate(`/forums/${item.data._id}`);
        break;
      case 'Thread':
        navigate(`/forums/thread/${item.data._id}`);
        break;
      case 'Post':
        navigate(`/forums/thread/${item.data.thread}/post/${item.data._id}`);
        break;
      case 'Comment':
        navigate(`/forums/thread/${item.data.thread}/post/${item.data.post}#comment-${item.data._id}`);
        break;
    }
  };

  // Function to get the right icon for each result type
  const getIcon = (type: string) => {
    switch (type) {
      case 'Forum':
        return <Folder className="h-5 w-5 text-blue-500" />;
      case 'Thread':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'Post':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'Comment':
        return <MessageCircle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  // Function to format dates
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to get a display title for each result type
  const getDisplayTitle = (item: SearchResultItem) => {
    switch (item.type) {
      case 'Forum':
        return item.data.title;
      case 'Thread':
        return item.data.title;
      case 'Post':
        return `Post in thread`;
      case 'Comment':
        return `Comment on post`;
      default:
        return 'Unknown item';
    }
  };

  // Render search results
  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      );
    }

    // Ensure searchResult has the expected data
    const results = searchResult?.searchResults as SearchResultItem[] || [];

    if (!results || results.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No results found. Try a different search term.
        </div>
      );
    }

    return (<div>
        <SearchBar />
      <div className="space-y-4">
        {results.map((item, index) => (
          <Card 
            key={`${item.type}-${item.data._id || index}`} 
            className="hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <CardTitle className="text-lg">
                  {getDisplayTitle(item)}
                </CardTitle>
              </div>
              <Badge>{item.type}</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {item.type === 'Post' || item.type === 'Comment' ? (
                <div className="line-clamp-2">{item.data.content}</div>
              ) : (
                item.data.description && <CardDescription>{item.data.description}</CardDescription>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                {formatDate(item.data.createdAt)} • Match confidence: {(item.certainty * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      {/* Search form at the top of results page */}
      <SearchBar />
      <h1 className="text-2xl font-bold mb-4">
        Search Results {searchQuery ? `for "${searchQuery}"` : ""}
      </h1>
      
      {renderResults()}
    </div>
  );
}