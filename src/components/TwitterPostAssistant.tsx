import React, { useState, useEffect } from 'react'
import { MessageSquare, Scissors, Copy, Check } from 'lucide-react'

interface TwitterPostAssistantProps {
  content: string;
  onSelectOption: (option: string) => void;
}

const TwitterPostAssistant = ({ content, onSelectOption }: TwitterPostAssistantProps) => {
  const [condensedVersion, setCondensedVersion] = useState<string>('')
  const [threadVersion, setThreadVersion] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<'condensed' | 'thread' | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (content.length > 280) {
      // Create condensed version
      setCondensedVersion(createCondensedVersion(content))
      
      // Create thread version
      setThreadVersion(createThreadVersion(content))
    }
  }, [content])

  const createCondensedVersion = (text: string): string => {
    if (text.length <= 280) return text;
    
    // Simple condensing strategy:
    // 1. Remove unnecessary words
    let condensed = text
      .replace(/\b(just|that|very|really|actually|basically|definitely|totally)\b\s*/gi, '')
      .replace(/\b(i think|in my opinion|from my perspective)\b\s*/gi, '')
      .replace(/\b(in order to)\b/gi, 'to')
      .replace(/\b(due to the fact that)\b/gi, 'because')
      .replace(/\b(at this point in time)\b/gi, 'now')
      .replace(/\b(for the purpose of)\b/gi, 'for')
      .replace(/\b(in the event that)\b/gi, 'if')
      .replace(/\b(a large number of)\b/gi, 'many')
      .replace(/\b(the vast majority of)\b/gi, 'most')
      .replace(/\b(in spite of the fact that)\b/gi, 'although')
      .trim();
    
    // 2. Replace "and" with "&" where appropriate
    condensed = condensed.replace(/\s+and\s+/g, ' & ');
    
    // 3. Use shorter word alternatives
    const wordReplacements: Record<string, string> = {
      'approximately': 'about',
      'assistance': 'help',
      'attempt': 'try',
      'currently': 'now',
      'demonstrate': 'show',
      'determine': 'find',
      'implement': 'do',
      'individual': 'person',
      'information': 'info',
      'regarding': 'about',
      'requirements': 'needs',
      'utilize': 'use',
    };
    
    Object.entries(wordReplacements).forEach(([word, replacement]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      condensed = condensed.replace(regex, replacement);
    });
    
    // 4. If still too long, truncate with ellipsis
    if (condensed.length > 277) {
      // Find a good breaking point (end of sentence or clause)
      let breakPoint = 277;
      while (breakPoint > 200 && !/[.!?,;]/.test(condensed[breakPoint])) {
        breakPoint--;
      }
      
      // If no good breaking point found, just cut at word boundary
      if (breakPoint <= 200) {
        breakPoint = 277;
        while (breakPoint > 240 && condensed[breakPoint] !== ' ') {
          breakPoint--;
        }
      }
      
      condensed = condensed.substring(0, breakPoint) + '...';
    }
    
    return condensed;
  };

  const createThreadVersion = (text: string): string[] => {
    if (text.length <= 280) return [text];
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const threads: string[] = [];
    let currentThread = '';
    
    sentences.forEach(sentence => {
      const potentialThread = currentThread + (currentThread ? ' ' : '') + sentence.trim();
      
      if (potentialThread.length <= 280) {
        currentThread = potentialThread;
      } else {
        if (currentThread) {
          threads.push(currentThread);
        }
        
        // If a single sentence is too long, split it further
        if (sentence.length > 280) {
          const words = sentence.split(' ');
          currentThread = '';
          
          words.forEach(word => {
            const potentialPart = currentThread + (currentThread ? ' ' : '') + word;
            
            if (potentialPart.length <= 280) {
              currentThread = potentialPart;
            } else {
              threads.push(currentThread);
              currentThread = word;
            }
          });
        } else {
          currentThread = sentence.trim();
        }
      }
    });
    
    if (currentThread) {
      threads.push(currentThread);
    }
    
    // Add thread numbering
    return threads.map((thread, index) => 
      `${thread} (${index + 1}/${threads.length})`
    );
  };

  const handleCopyThread = (index: number) => {
    navigator.clipboard.writeText(threadVersion[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyCondensed = () => {
    navigator.clipboard.writeText(condensedVersion);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelectOption = (option: 'condensed' | 'thread') => {
    setSelectedOption(option);
    if (option === 'condensed') {
      onSelectOption(condensedVersion);
    } else {
      onSelectOption(threadVersion[0]);
    }
  };

  if (content.length <= 280) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-orange-100 p-2 rounded-full">
          <MessageSquare size={18} className="text-orange-600" />
        </div>
        <div>
          <h3 className="font-medium text-orange-800">Your tweet exceeds the 280 character limit</h3>
          <p className="text-sm text-orange-700">Current length: {content.length} characters (limit: 280)</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedOption === 'condensed' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleSelectOption('condensed')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Scissors size={16} className="text-blue-600" />
              <h4 className="font-medium">Condensed Version</h4>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCopyCondensed();
              }}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              {copiedIndex === -1 ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-2">{condensedVersion}</p>
          <div className="text-xs text-gray-500 flex justify-between">
            <span>{condensedVersion.length}/280 characters</span>
            <span className="text-blue-600">Select this option</span>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedOption === 'thread' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleSelectOption('thread')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              <h4 className="font-medium">Thread Version ({threadVersion.length} tweets)</h4>
            </div>
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {threadVersion.map((tweet, index) => (
              <div key={index} className="text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <p className="flex-1">{tweet}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyThread(index);
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
                  >
                    {copiedIndex === index ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 flex justify-end mt-2">
            <span className="text-blue-600">Select this option</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPostAssistant;
