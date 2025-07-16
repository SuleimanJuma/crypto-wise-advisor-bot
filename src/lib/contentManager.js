// Sample lesson data structure
export const sampleLessons = {
  ethereum: [
    {
      title: "What is Ethereum?",
      category: "Ethereum",
      order_index: 1,
      content: `# What is Ethereum?

## Introduction
Ethereum is a decentralized platform that runs smart contracts - applications that run exactly as programmed without any possibility of downtime, censorship, fraud, or third-party interference.

## Key Concepts
- **Smart Contracts**: Self-executing contracts with terms directly written into code
- **Ether (ETH)**: The native cryptocurrency that powers the network
- **Gas**: The fee required to execute transactions and smart contracts
- **Decentralized**: No single entity controls the network

## Why Ethereum Matters
Ethereum enables:
- Programmable money
- Decentralized applications (dApps)
- Decentralized finance (DeFi)
- NFTs and digital ownership

## Visual Learning
Understanding Ethereum's architecture helps visualize how transactions flow through the network.

## Next Steps
In the next lesson, we'll explore how to create your first Ethereum wallet and start interacting with the network safely.

## Key Takeaways
- Ethereum is programmable money
- Smart contracts eliminate intermediaries
- Gas fees power network security
- Decentralization ensures no single point of failure`
    },
    {
      title: "Creating Your First Wallet",
      category: "Ethereum",
      order_index: 2,
      content: `# Creating Your First Ethereum Wallet

## What is a Crypto Wallet?
A crypto wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. It doesn't actually store your crypto - it stores the private keys that give you access to your funds.

## Types of Wallets
1. **Hot Wallets**: Connected to the internet (convenient but less secure)
2. **Cold Wallets**: Offline storage (more secure but less convenient)
3. **Software Wallets**: Apps on your phone or computer
4. **Hardware Wallets**: Physical devices for maximum security

## Setting Up MetaMask (Recommended for Beginners)
1. Visit metamask.io
2. Download the browser extension
3. Create a new wallet
4. **CRITICAL**: Write down your seed phrase and store it safely
5. Never share your seed phrase with anyone

## Security Best Practices
- Use a strong password
- Enable two-factor authentication where available
- Never screenshot or digitally store your seed phrase
- Consider using a hardware wallet for large amounts

## Common Mistakes to Avoid
- Storing seed phrases digitally
- Using public WiFi for wallet transactions
- Clicking suspicious links
- Sharing private keys or seed phrases

## Practice Exercise
1. Install MetaMask
2. Create a test wallet
3. Practice sending a small amount to another address
4. Learn to view your transaction on Etherscan

## Key Takeaways
- Your seed phrase is your ultimate backup
- Security should always be your top priority
- Start with small amounts while learning
- Hardware wallets offer the best security for larger holdings`
    }
  ],
  safety: [
    {
      title: "Avoiding Crypto Scams",
      category: "Safety",
      order_index: 1,
      content: `# Avoiding Crypto Scams

## Common Scam Types
### 1. Phishing Attacks
- Fake websites that steal your login credentials
- Always check URLs carefully
- Bookmark legitimate sites

### 2. Social Engineering
- Impersonators on social media
- Fake customer support
- Romance scams involving crypto

### 3. Ponzi Schemes
- Promises of guaranteed returns
- "Get rich quick" schemes
- Pyramid-style referral programs

### 4. Fake Exchanges
- Unregulated platforms
- Withdrawal restrictions
- Poor security practices

## Red Flags to Watch For
- Guaranteed returns or "risk-free" investments
- Pressure to act quickly
- Requests for private keys or seed phrases
- Unregistered investment opportunities
- Celebrity endorsements (often fake)

## Protection Strategies
1. **Verify Everything**: Double-check URLs, social media accounts, and contact information
2. **Use Reputable Platforms**: Stick to well-known exchanges and wallets
3. **Enable Security Features**: 2FA, withdrawal whitelisting, email confirmations
4. **Stay Informed**: Follow crypto security news and updates
5. **Trust Your Instincts**: If something feels wrong, it probably is

## If You're Scammed
1. Document everything
2. Report to relevant authorities
3. Warn others in the community
4. Learn from the experience

## Key Takeaways
- Scammers target both beginners and experienced users
- Legitimate companies never ask for private keys
- Education is your best defense
- When in doubt, don't act`
    }
  ]
};
import { createClient } from '@supabase/supabase-js';

// Use the same env vars as the rest of your app
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const contentManager = {
  // Add a new lesson
  async addLesson(lessonData) {
    const { data, error } = await supabase
      .from('lessons')
      .insert([{
        title: lessonData.title,
        content: lessonData.content,
        category: lessonData.category,
        order: lessonData.order, // use 'order' to match your schema
        image_url: lessonData.image_url || null,
        video_url: lessonData.video_url || null
      }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Get lessons by category
  async getLessonsByCategory(category) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('category', category)
      .order('order');
    if (error) throw error;
    return data;
  },

  // Get all lessons with progress
  async getLessonsWithProgress(userId) {
    const { data, error } = await supabase
      .from('lessons')
      .select(`*,user_lesson_progress!left(completed_at,user_id)`)
      .eq('user_lesson_progress.user_id', userId)
      .order('category')
      .order('order');
    if (error) throw error;
    return data;
  },

  // Upload lesson image
  async uploadLessonImage(file, lessonId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `lesson-${lessonId}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('lesson-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    if (error) throw error;
    const { data: urlData } = await supabase.storage
      .from('lesson-images')
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  },

  // Mark lesson as complete
  async markLessonComplete(userId, lessonId) {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString()
      });
    if (error) throw error;
    return data;
  }
};
