// Feed Page - Main app interface
// View and create ephemeral posts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../api';

function Feed({ user, onLogout }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  // Load posts
  const loadPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await postsAPI.getStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    loadPosts();
    loadStats();

    // Auto-refresh posts every 10 seconds
    const interval = setInterval(() => {
      loadPosts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPostContent.trim()) {
      return;
    }

    if (newPostContent.length > 500) {
      setError('Post must be 500 characters or less');
      return;
    }

    setPosting(true);

    try {
      await postsAPI.create(newPostContent);
      setNewPostContent('');
      loadPosts();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;

    try {
      await postsAPI.delete(postId);
      loadPosts();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  // Format time remaining
  const formatTimeRemaining = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-clandestine-darkest">
      {/* Header */}
      <header className="bg-clandestine-darker border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-100 font-mono">
              IF I TELL YOU <span className="text-red-500">I'M GOING TO KILL YOU</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono">CALLSIGN: {user?.username}</p>
          </div>
          <div className="flex items-center gap-4">
            {stats && (
              <div className="text-gray-500 text-xs hidden sm:block font-mono">
                {stats.activePosts} ACTIVE · {stats.totalUsers} OPERATIVES
              </div>
            )}
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-gray-200 text-xs transition-colors font-mono"
            >
              DISCONNECT
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Create post */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 font-mono">
            TRANSMIT MESSAGE
          </h2>
          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="input-field w-full h-24 resize-none mb-2 font-mono text-sm"
              placeholder="Enter classified communication... (Auto-destructs in 24 hours)"
              maxLength={500}
              disabled={posting}
            />
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs font-mono">
                {newPostContent.length}/500 · T+24:00:00 DESTRUCT
              </span>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200 text-xs font-mono"
                disabled={posting || !newPostContent.trim()}
              >
                {posting ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
              </button>
            </div>
            {error && (
              <div className="mt-3 p-2 bg-red-900/20 border border-red-800 rounded text-red-400 text-xs font-mono">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Privacy reminder */}
        <div className="bg-red-900/10 border border-red-800/30 rounded p-4 mb-6 text-xs text-gray-400 font-mono">
          <span className="font-semibold text-red-400">OPSEC REMINDER:</span> All transmissions auto-destruct 
          in 24 hours. Zero-trace protocol active. No analytics. No permanent storage.
        </div>

        {/* Posts feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500 font-mono text-sm">
              LOADING TRANSMISSIONS...
            </div>
          ) : posts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-2 font-mono text-sm">NO ACTIVE TRANSMISSIONS</p>
              <p className="text-gray-600 text-xs font-mono">BE THE FIRST TO TRANSMIT</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="card hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-gray-300 font-semibold font-mono text-sm">
                      {post.username}
                    </span>
                    <span className="text-gray-600 text-xs ml-2 font-mono">
                      · {formatTimestamp(post.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-xs font-mono">
                      ⏱️ T-{formatTimeRemaining(post.timeRemaining)}
                    </span>
                    {post.username === user?.username && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-gray-600 hover:text-red-400 text-xs transition-colors font-mono"
                      >
                        DELETE
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{post.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-gray-600 text-xs py-6 font-mono">
          <p className="text-gray-500">IF I TELL YOU, <span className="text-red-500">I'M GOING TO KILL YOU</span></p>
          <p className="mt-2 tracking-wider">DBTC SECURE NETWORK · ZERO-TRACE COMMUNICATIONS</p>
        </div>
      </main>
    </div>
  );
}

export default Feed;
