import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { stdout, stderr } = await execAsync('python utils/generate_blog_post.py');
      console.log(stdout);
      console.error(stderr);
      res.status(200).json({ message: 'Blog post generated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate blog post' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
