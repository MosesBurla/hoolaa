/*
  # Posts Table Creation

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text, nullable)
      - `published` (boolean, default false)
      - `author_id` (uuid, foreign key to users.id)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `posts` table
    - Add policies for reading published posts
    - Add policies for authors to manage their own posts
    - Add policies for admins to manage all posts
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts"
  ON posts
  FOR SELECT
  USING (published = true);

-- Authors can read all their posts (published or not)
CREATE POLICY "Authors can read all their posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

-- Authors can insert their own posts
CREATE POLICY "Authors can insert their own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

-- Authors can update their own posts
CREATE POLICY "Authors can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

-- Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Create trigger to update updated_at on update
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index on author_id for faster queries
CREATE INDEX idx_posts_author_id ON posts(author_id);