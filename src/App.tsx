import React, { useState } from 'react'
import { FileText, Send, Copy, RefreshCw, Edit, X } from 'lucide-react'
import Header from './components/Header'
import TweetCard from './components/TweetCard'
import FileUploader from './components/FileUploader'
import TwitterPostAssistant from './components/TwitterPostAssistant'
import { generateTweets } from './utils/tweetGenerator'

function App() {
  const [topic, setTopic] = useState('')
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [tweets, setTweets] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [customTweet, setCustomTweet] = useState('')
  const [showCustomEditor, setShowCustomEditor] = useState(false)

  const handleFileUpload = (content: string, name: string) => {
    setFileContent(content)
    setFileName(name)
  }

  const handleRemoveAttachment = () => {
    setFileContent(null)
    setFileName(null)
  }

  const handleGenerateTweets = () => {
    setIsGenerating(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const generatedTweets = generateTweets(topic, fileContent)
      setTweets(generatedTweets)
      setIsGenerating(false)
    }, 1000)
  }

  const handleRefresh = () => {
    if (topic || fileContent) {
      handleGenerateTweets()
    }
  }

  const handleTweetSelect = (tweet: string) => {
    setCustomTweet(tweet)
    setShowCustomEditor(true)
  }

  const handleAssistantOption = (option: string) => {
    setCustomTweet(option)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Customize Your Tweets</h2>
          
          <div className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              What would you like to tweet about?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="topic"
                placeholder="E.g., first day as an intern, work-from-home, tech learning journey..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button
                onClick={handleGenerateTweets}
                disabled={!topic && !fileContent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
                Generate
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FileText size={18} className="text-gray-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Upload a file for reference (optional)</h3>
            </div>
            <FileUploader onFileUpload={handleFileUpload} />
            
            {fileName && (
              <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-md border border-blue-100">
                <div className="flex items-center text-sm text-gray-600">
                  <FileText size={14} className="mr-1 text-blue-500" />
                  <span>Using: {fileName}</span>
                </div>
                <button 
                  onClick={handleRemoveAttachment}
                  className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Remove attachment"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {showCustomEditor && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Customize Your Tweet</h2>
              <button 
                onClick={() => setShowCustomEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customTweet}
              onChange={(e) => setCustomTweet(e.target.value)}
              placeholder="Edit your tweet here..."
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${customTweet.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
                {customTweet.length}/280 characters
              </span>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                onClick={() => {
                  if (customTweet.length <= 280) {
                    // In a real app, this would post to Twitter
                    alert('Tweet ready to post!');
                  }
                }}
                disabled={customTweet.length > 280}
              >
                Post Tweet
              </button>
            </div>
            
            {customTweet.length > 280 && (
              <TwitterPostAssistant 
                content={customTweet} 
                onSelectOption={handleAssistantOption}
              />
            )}
          </div>
        )}
        
        {tweets.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Tweet Ideas</h2>
              <button 
                onClick={handleRefresh}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {tweets.map((tweet, index) => (
                <TweetCard 
                  key={index} 
                  content={tweet} 
                  onEdit={() => handleTweetSelect(tweet)}
                />
              ))}
            </div>
          </div>
        )}
        
        {isGenerating && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </main>
      
      <footer className="bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Tweet Idea Generator for Interns © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
