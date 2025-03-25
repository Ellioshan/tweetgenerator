import React, { useState } from 'react'
import { Copy, Check, Twitter, Edit } from 'lucide-react'

interface TweetCardProps {
  content: string;
  onEdit?: () => void;
}

const TweetCard = ({ content, onEdit }: TweetCardProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Twitter size={16} className="text-blue-500" />
          </div>
          <span className="text-sm font-medium text-gray-700">Tweet Idea</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            title="Copy to clipboard"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              title="Edit tweet"
            >
              <Edit size={16} />
            </button>
          )}
        </div>
      </div>
      
      <p className="text-gray-800 mb-3">{content}</p>
      
      <div className="flex justify-between items-center">
        <span className={`text-xs ${content.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
          {content.length}/280 characters
        </span>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Tweet this
        </a>
      </div>
    </div>
  )
}

export default TweetCard
