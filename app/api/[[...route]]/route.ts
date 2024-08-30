import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import authors from './authors'
import books from './books'

export const runtime = 'edge'
const app = new Hono().basePath('/api')

app.get('/', clerkMiddleware(), (c) => {
    const auth = getAuth(c)
    if (!auth?.userId) {
        return c.json({ error: "Not authenticated" })
    }
    return c.json({
        message: 'Hello Next.js!',
        userId: auth.userId
    })
})

app.get('/hello', (c) => c.json({ message: 'Hello Next.js!' }))

app.route('/authors', authors)   
app.route('/books', books) 

export const GET = handle(app)
export const POST = handle(app)