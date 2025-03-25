// Sample tweet templates for different categories
const templates = {
  general: [
    "Just had my {nth} coffee of the day. The intern life runs on caffeine and optimism! ☕️ #InternLife",
    "When your code finally works after 3 hours of debugging and you don't know why 🤷‍♂️ #TechIntern #ItWorks",
    "That moment when your manager compliments your work and you're trying not to do a happy dance in the meeting 🕺 #CareerWin",
    "Pro tip: Always look busy when the CEO walks by. My strategy? Open 3 VS Code windows and furiously type gibberish 😂 #InternHacks",
    "Today I learned that 'I'll figure it out' is corporate speak for 'I have no idea but I'll Google it frantically later' 🔍 #WorkLife",
    "Imposter syndrome hitting hard today, but then I remembered even senior devs Google the basics 🌟 #WeAreAllLearning",
    "My workspace setup vs the Instagram 'day in the life of a dev' posts... let's just say reality isn't as aesthetic 📱 #RealTechLife",
    "The best part about WFH? Business professional on top, pajama party on bottom 👔+🩳 #RemoteIntern",
    "Trying to explain my tech job to my grandma: 'No, I don't fix printers' 🖨️ #TechProblems",
    "That Friday feeling when you submit your work before deadline and your mentor says 'looks good!' ✨ #WeekendVibes"
  ],
  firstDay: [
    "First day as an intern and I've already mastered the art of nodding confidently while understanding absolutely nothing 😎 #NewIntern",
    "Day 1 at the new gig! So far I've set up my email, attended 3 meetings, and pretended to understand 5 acronyms 🤓 #InternLife",
    "Successfully completed my first day without spilling coffee on my laptop or calling my boss by the wrong name. I call that a win! 🏆 #FirstDayIntern",
    "First day jitters + 3 cups of coffee = one very energetic but anxious intern 😅 #NewJobEnergy",
    "My first day todo list: 1. Don't break anything 2. Remember names 3. Find the good snacks 4. Figure out what I'm actually supposed to do ✅ #InternGoals"
  ],
  wfh: [
    "WFH reality: Professional on Zoom, haven't moved from my bed in 3 hours 🛌 #RemoteIntern",
    "My WFH setup includes a cat who thinks keyboard walking is helping and a neighbor who's apparently starting a band 🐱🎸 #WorkFromHomeFun",
    "The hardest part of working from home is convincing myself that lunch cannot be ice cream straight from the container 🍦 #WFHProblems",
    "Just had a very serious meeting with my cat as the co-presenter. She had some strong opinions on the quarterly report 😸 #PetCoworkers",
    "WFH productivity hack: set a timer for 25 minutes of focus, reward self with 5 minutes of staring blankly at the fridge 🕒 #PomodoroTechnique"
  ],
  impostor: [
    "Today's mood: Googling things I definitely should know by now while hoping nobody notices 🕵️‍♀️ #ImposterSyndrome",
    "When someone calls you an 'expert' but you're just really good at finding the right Stack Overflow answers 👀 #FakeItTillYouMakeIt",
    "Imposter syndrome is thinking everyone else knows what they're doing. Plot twist: we're all just figuring it out as we go 🌀 #TruthBomb",
    "That moment in the meeting when you realize you're not the only one who has no idea what's going on 👥 #WeAreAllImposters",
    "Dear diary: Today I contributed to a meeting without prefacing my idea with 'this might be stupid but...' Progress! 🎉 #GrowthMindset"
  ],
  learning: [
    "Week 3 of learning a new framework: I now understand enough to know how much I don't understand 🧠 #LearningCurve",
    "My browser history is just variations of 'how to [basic thing] in [language I should know]' and I'm not even sorry 🔍 #AlwaysLearning",
    "Today's small win: Fixed a bug by actually understanding the solution instead of random trial and error 🎯 #LevelUp",
    "The best feeling is when a concept finally clicks after days of confusion. It's like finding the light switch in a dark room! 💡 #AhaMoment",
    "Learning to code is like solving a mystery where you're both the detective and the criminal who wrote the buggy code 🕵️‍♀️ #DevLife"
  ]
};

// Function to extract key points from file content
const extractKeyPoints = (fileContent: string | null): string[] => {
  if (!fileContent) return [];
  
  // Simple extraction - split by sentences and take the first few
  const sentences = fileContent.split(/[.!?]+/).filter(s => s.trim().length > 5);
  return sentences.slice(0, 5);
};

// Function to generate tweets based on topic and file content
export const generateTweets = (topic: string, fileContent: string | null): string[] => {
  const result: string[] = [];
  const keyPoints = extractKeyPoints(fileContent);
  
  // Determine which template category to use based on topic
  let categoryTemplates = templates.general;
  
  const topicLower = topic.toLowerCase();
  if (topicLower.includes('first day') || topicLower.includes('new job') || topicLower.includes('started')) {
    categoryTemplates = templates.firstDay;
  } else if (topicLower.includes('wfh') || topicLower.includes('work from home') || topicLower.includes('remote')) {
    categoryTemplates = templates.wfh;
  } else if (topicLower.includes('imposter') || topicLower.includes('impostor') || topicLower.includes('confidence')) {
    categoryTemplates = templates.impostor;
  } else if (topicLower.includes('learning') || topicLower.includes('study') || topicLower.includes('skills')) {
    categoryTemplates = templates.learning;
  }
  
  // Generate tweets from templates
  const shuffledTemplates = [...categoryTemplates].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(4, shuffledTemplates.length); i++) {
    let tweet = shuffledTemplates[i]
      .replace('{nth}', ['first', 'second', 'third', 'fourth', 'fifth'][Math.floor(Math.random() * 5)]);
      
    // Add topic if provided
    if (topic && !tweet.toLowerCase().includes(topicLower)) {
      // Sometimes add the topic at the beginning
      if (Math.random() > 0.5) {
        tweet = `${topic.charAt(0).toUpperCase() + topic.slice(1)} thoughts: ${tweet}`;
      } 
      // Sometimes add a hashtag at the end
      else {
        const hashtag = '#' + topic.replace(/\s+/g, '');
        if (!tweet.includes(hashtag)) {
          tweet = tweet + ' ' + hashtag;
        }
      }
    }
    
    result.push(tweet);
  }
  
  // Generate tweets from file content if available
  if (keyPoints.length > 0) {
    const fileBasedTweets = [
      `Just read this gem: "${keyPoints[0]}" 💎 #LearningEveryday`,
      `Today I learned: ${keyPoints.length > 1 ? keyPoints[1] : keyPoints[0]} 🧠 #GrowthMindset`,
      `Hot take from my reading today: ${keyPoints.length > 2 ? keyPoints[2] : keyPoints[0]} Thoughts? 🤔 #InternInsights`
    ];
    
    result.push(...fileBasedTweets.slice(0, 2));
  }
  
  // Generate some custom tweets based on topic if provided
  if (topic) {
    const customTweets = [
      `Been diving deep into ${topic} today. My brain is full but my coffee cup is empty! ☕ #AlwaysLearning`,
      `That moment when you finally understand ${topic} after staring at documentation for hours 🤯 #Breakthrough`,
      `Asked a "quick question" about ${topic} in the team chat and accidentally started a 45-minute debate 😅 #TeamDiscussions`
    ];
    
    result.push(...customTweets.slice(0, 2));
  }
  
  // Ensure all tweets are within character limit
  return result
    .map(tweet => tweet.length > 280 ? tweet.substring(0, 277) + '...' : tweet)
    .filter((tweet, index, self) => self.indexOf(tweet) === index) // Remove duplicates
    .slice(0, 6); // Limit to 6 tweets
};
