import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchPost } from '../utils/posts'
import { PostErrorComponent } from '~/components/PostError'
import * as v from 'valibot'
import { useId, useState } from 'react'


export const ChatsPageSearchSchema = v.object({
  someId: v.optional(v.array(v.string())),
  anotherId: v.optional(v.string()),
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

  loader: async ({ params: { postId }, deps }) => {

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
  const { post } = Route.useLoaderData()
  const navigate = Route.useNavigate()

  const [randomState] = useState(() => Math.random().toString(36).slice(2))

  // console.log('random state', randomState) 

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
        className="px-2 py-1 bg-blue-500 active:bg-blue-700 text-white rounded"
        onClick={() =>
          navigate({
            search: prev => ({
              ...prev,
              someId: Array.from({ length: Math.ceil(Math.random() * 5) }, () => Math.random().toString()),
            }),
          })
        }
      >
        Update Search Params 1
      </button>
      <button
        className="px-2 py-1 bg-green-500 active:bg-green-700 text-white rounded"
        onClick={() =>
          navigate({
            search: prev => ({
              ...prev,
              anotherId: Math.random().toString(),
            }),
          })
        }
      >
        Update Search Params 2
      </button>
      <button
        className="px-2 py-1 bg-gray-500 active:bg-gray-700 text-white rounded"
        onClick={() => navigate({
          search: {},
        })}
      >
        Reset Search Params
      </button>
    </div>
  )
}
