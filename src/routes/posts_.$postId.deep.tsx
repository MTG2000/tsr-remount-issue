import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchPost } from '../utils/posts'
import { PostErrorComponent } from '~/components/PostError'
import * as v from 'valibot'
import { useId } from 'react'


export const ChatsPageSearchSchema = v.object({
  someId: v.optional(v.string()),
})

export const Route = createFileRoute('/posts_/$postId/deep')({
  validateSearch(search) {
    return v.parse(ChatsPageSearchSchema, search)
  },

  loaderDeps(opts) {
    return {
      search: opts.search,
    }
  },
  ssr: false,

  loader: async ({ params: { postId }, deps }) =>{
    
     const post = await fetchPost({
      data: postId,
    })

    return {
      post, 
      search: deps.search,
    }
  },
  errorComponent: PostErrorComponent,
  component: PostDeepComponent,
})

function PostDeepComponent() {
  const {post} = Route.useLoaderData()
  const navigate = Route.useNavigate()

  console.log(useId())

  return (
    <div className="p-2 space-y-2">
      <Link
        to="/posts"
        className="block py-1 text-blue-800 hover:text-blue-600"
      >
        ← All Posts
      </Link>
      <h4 className="text-xl font-bold underline">{post.title}</h4>
      <div className="text-sm">{post.body}</div>
       <button
      onClick={() =>
        navigate({
          search: {
            someId: 'hello',
          },
        })
      }
    >
      hello
    </button>
    </div>
  )
}
