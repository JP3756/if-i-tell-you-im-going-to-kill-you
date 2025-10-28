// Database implementation using in-memory storage for development
// For production, use a proper database service like Supabase or PostgreSQL
// This in-memory version is privacy-first and requires no build tools

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In-memory database with file persistence
class SimpleDB {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {
      users: [],
      posts: [],
      invite_tokens: []
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileData = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(fileData);
        console.log('✓ Database loaded from file');
      }
    } catch (error) {
      console.log('Starting with fresh database');
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  // Query helpers
  prepare(query) {
    const self = this;
    
    return {
      run(...params) {
        const result = self.executeQuery(query, params);
        self.saveToFile();
        return result;
      },
      get(...params) {
        return self.executeQuery(query, params, true);
      },
      all(...params) {
        return self.executeQuery(query, params, false, true);
      }
    };
  }

  executeQuery(query, params = [], getOne = false, getAll = false) {
    const lowerQuery = query.toLowerCase().trim();

    // INSERT queries
    if (lowerQuery.startsWith('insert into users')) {
      const [username, inviteToken, createdAt, sessionToken] = params;
      const id = this.data.users.length + 1;
      const user = { id, username, invite_token: inviteToken, created_at: createdAt, session_token: sessionToken };
      this.data.users.push(user);
      return { lastInsertRowid: id, changes: 1 };
    }

    if (lowerQuery.startsWith('insert into posts')) {
      const [userId, content, createdAt, expiresAt] = params;
      const id = this.data.posts.length + 1;
      const post = { id, user_id: userId, content, created_at: createdAt, expires_at: expiresAt };
      this.data.posts.push(post);
      return { lastInsertRowid: id, changes: 1 };
    }

    if (lowerQuery.startsWith('insert into invite_tokens')) {
      const [token, createdAt, used] = params;
      const invite = { token, created_at: createdAt, used };
      this.data.invite_tokens.push(invite);
      return { lastInsertRowid: this.data.invite_tokens.length, changes: 1 };
    }

    // SELECT queries
    if (lowerQuery.includes('from users')) {
      let users = [...this.data.users];
      
      if (lowerQuery.includes('where username')) {
        users = users.filter(u => u.username === params[0]);
      } else if (lowerQuery.includes('where session_token')) {
        users = users.filter(u => u.session_token === params[0]);
      }

      if (getAll) return users;
      return getOne ? users[0] || null : users;
    }

    if (lowerQuery.includes('from posts')) {
      let posts = [...this.data.posts];
      
      if (lowerQuery.includes('where expires_at <')) {
        // For cleanup
        posts = posts.filter(p => p.expires_at < params[0]);
      } else if (lowerQuery.includes('where expires_at >')) {
        // For active posts with JOIN
        posts = posts
          .filter(p => p.expires_at > params[0])
          .map(p => {
            const user = this.data.users.find(u => u.id === p.user_id);
            return {
              ...p,
              username: user ? user.username : 'unknown'
            };
          })
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 100);
      } else if (lowerQuery.includes('where id')) {
        posts = posts.filter(p => p.id === parseInt(params[0]));
      }

      if (lowerQuery.includes('count(*)')) {
        return { count: posts.length };
      }

      if (getAll) return posts;
      return getOne ? posts[0] || null : posts;
    }

    if (lowerQuery.includes('from invite_tokens')) {
      let tokens = [...this.data.invite_tokens];
      
      if (lowerQuery.includes('where token') && lowerQuery.includes('and used')) {
        tokens = tokens.filter(t => t.token === params[0] && t.used === 0);
      } else if (lowerQuery.includes('where token')) {
        tokens = tokens.filter(t => t.token === params[0]);
      }

      if (getAll) return tokens;
      return getOne ? tokens[0] || null : tokens;
    }

    // UPDATE queries
    if (lowerQuery.startsWith('update invite_tokens')) {
      const [usedAt, token] = params;
      const invite = this.data.invite_tokens.find(t => t.token === token);
      if (invite) {
        invite.used = 1;
        invite.used_at = usedAt;
        return { changes: 1 };
      }
      return { changes: 0 };
    }

    if (lowerQuery.startsWith('update users') && lowerQuery.includes('set session_token = null')) {
      const [sessionToken] = params;
      const user = this.data.users.find(u => u.session_token === sessionToken);
      if (user) {
        user.session_token = null;
        return { changes: 1 };
      }
      return { changes: 0 };
    }

    // DELETE queries
    if (lowerQuery.startsWith('delete from posts where expires_at')) {
      const before = this.data.posts.length;
      this.data.posts = this.data.posts.filter(p => p.expires_at >= params[0]);
      return { changes: before - this.data.posts.length };
    }

    if (lowerQuery.startsWith('delete from posts where id')) {
      const before = this.data.posts.length;
      this.data.posts = this.data.posts.filter(p => p.id !== parseInt(params[0]));
      return { changes: before - this.data.posts.length };
    }

    // COUNT queries
    if (lowerQuery.includes('count(*)') && lowerQuery.includes('from users')) {
      return { count: this.data.users.length };
    }

    return getOne ? null : [];
  }

  exec() {
    // Noop for schema creation
    return this;
  }

  pragma() {
    // Noop
    return this;
  }
}

const db = new SimpleDB(join(__dirname, 'clandestine.json'));

// Clean up expired posts automatically
function cleanupExpiredPosts() {
  const now = Date.now();
  const stmt = db.prepare('DELETE FROM posts WHERE expires_at < ?');
  const result = stmt.run(now);
  
  if (result.changes > 0) {
    console.log(`✓ Cleaned up ${result.changes} expired post(s)`);
  }
  
  return result.changes;
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredPosts, 5 * 60 * 1000);

console.log('✓ Database initialized with privacy-first schema');

export { db, cleanupExpiredPosts };
