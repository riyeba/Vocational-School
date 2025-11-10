// import React, { useState, useCallback, useMemo } from 'react';
// import { Home, Calendar, Users, MessageSquare, User, ThumbsUp, Youtube, Music, Instagram, Send, MoreHorizontal, Search, Bell } from 'lucide-react';

// // Custom hooks for better state management
// const useLocalState = (key, initialValue) => {
//   const [state, setState] = useState(() => {
//     try {
//       return JSON.parse(window.localStorage?.getItem(key) || JSON.stringify(initialValue));
//     } catch {
//       return initialValue;
//     }
//   });

//   const setValue = useCallback((value) => {
//     setState(value);
//     try {
//       window.localStorage?.setItem(key, JSON.stringify(value));
//     } catch {}
//   }, [key]);

//   return [state, setValue];
// };

// // Component constants
// const NAV_ITEMS = [
//   { name: 'Home', icon: Home, badge: null },
//   { name: 'Events', icon: Calendar, badge: 3 },
//   { name: 'Connect', icon: Users, badge: null },
//   { name: 'Messages', icon: MessageSquare, badge: 12 }
// ];

// const SOCIAL_LINKS = [
//   { 
//     name: 'YouTube', 
//     icon: Youtube, 
//     color: 'text-red-500', 
//     bgColor: 'bg-red-500/10 hover:bg-red-500/20',
//     url: 'https://youtube.com/skaots'
//   },
//   { 
//     name: 'TikTok', 
//     icon: Music, 
//     color: 'text-pink-500', 
//     bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
//     url: 'https://tiktok.com/@skaots'
//   },
//   { 
//     name: 'Instagram', 
//     icon: Instagram, 
//     color: 'text-purple-500', 
//     bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
//     url: 'https://instagram.com/skaots'
//   }
// ];

// // Utility components
// const Avatar = ({ src, alt, size = 'md', className = '' }) => {
//   const sizeClasses = {
//     sm: 'w-8 h-8',
//     md: 'w-12 h-12',
//     lg: 'w-20 h-20 sm:w-24 sm:h-24',
//     xl: 'w-32 h-32'
//   };

//   return (
//     <div className={`${sizeClasses[size]} bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center ring-2 ring-gray-700/50 ${className}`}>
//       {src ? (
//         <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
//       ) : (
//         <User className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-16 h-16'} text-gray-300`} />
//       )}
//     </div>
//   );
// };

// const Button = ({ 
//   children, 
//   variant = 'primary', 
//   size = 'md', 
//   disabled = false, 
//   loading = false,
//   className = '', 
//   ...props 
// }) => {
//   const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
//   const variants = {
//     primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-green-500/25',
//     secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
//     ghost: 'text-gray-400 hover:text-white hover:bg-gray-800',
//     danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
//   };
  
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2',
//     lg: 'px-6 py-3 text-lg'
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading && (
//         <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
//       )}
//       {children}
//     </button>
//   );
// };

// const Badge = ({ count, className = '' }) => {
//   if (!count || count === 0) return null;
  
//   return (
//     <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 ${className}`}>
//       {count > 99 ? '99+' : count}
//     </span>
//   );
// };

// // Main component
// const SkaotsPlatform = () => {
//   const [activeNav, setActiveNav] = useLocalState('activeNav', 'Home');
//   const [postText, setPostText] = useState('');
//   const [posts, setPosts] = useLocalState('posts', [
//     {
//       id: 1,
//       user: 'Lamda Phi',
//       role: 'Fan',
//       avatar: null,
//       timestamp: new Date().toISOString(),
//       content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
//       likes: 0,
//       comments: 0,
//       shares: 0,
//       isLiked: false
//     },
//     {
//       id: 2,
//       user: 'Sunday Oliseh',
//       role: 'Basketball Athlete',
//       avatar: null,
//       timestamp: new Date(Date.now() - 3600000).toISOString(),
//       content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//       likes: 15,
//       comments: 3,
//       shares: 2,
//       isLiked: false,
//       verified: true
//     }
//   ]);

//   const [isPosting, setIsPosting] = useState(false);

//   // Memoized values
//   const currentUser = useMemo(() => ({
//     name: 'Kaka Jose',
//     role: 'Basketball Player',
//     networks: 7,
//     fans: 0,
//     avatar: null
//   }), []);

//   // Event handlers
//   const handlePostSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     if (!postText.trim() || isPosting) return;

//     setIsPosting(true);
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const newPost = {
//       id: Date.now(),
//       user: currentUser.name,
//       role: currentUser.role,
//       avatar: currentUser.avatar,
//       timestamp: new Date().toISOString(),
//       content: postText.trim(),
//       likes: 0,
//       comments: 0,
//       shares: 0,
//       isLiked: false
//     };

//     setPosts(prev => [newPost, ...prev]);
//     setPostText('');
//     setIsPosting(false);
//   }, [postText, currentUser, setPosts, isPosting]);

//   const handleLike = useCallback((postId) => {
//     setPosts(prev => prev.map(post => 
//       post.id === postId 
//         ? { 
//             ...post, 
//             isLiked: !post.isLiked,
//             likes: post.isLiked ? post.likes - 1 : post.likes + 1
//           }
//         : post
//     ));
//   }, [setPosts]);

//   const formatTimeAgo = useCallback((timestamp) => {
//     const now = new Date();
//     const time = new Date(timestamp);
//     const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return `${Math.floor(diffInMinutes / 1440)}d ago`;
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Enhanced Header */}
//       <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-xl">
//         <div className="max-w-7xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-lg">SK</span>
//               </div>
//               {/* <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
//                 Skaots
//               </span> */}
//             </div>

//             {/* Search Bar - Desktop */}
//             <div className="hidden lg:flex flex-1 max-w-md mx-8">
//               <div className="relative w-full">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search Skaots..."
//                   className="w-full bg-gray-700 border border-gray-600 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors"
//                 />
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav className="hidden md:flex items-center space-x-1">
//               {NAV_ITEMS.map((item) => {
//                 const IconComponent = item.icon;
//                 return (
//                   <button
//                     key={item.name}
//                     onClick={() => setActiveNav(item.name)}
//                     className={`relative flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-200 ${
//                       activeNav === item.name
//                         ? 'text-green-400 bg-green-400/10 shadow-lg'
//                         : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
//                     }`}
//                   >
//                     <IconComponent className="w-5 h-5" />
//                     <span className="text-xs font-medium">{item.name}</span>
//                     <Badge count={item.badge} />
//                   </button>
//                 );
//               })}
//             </nav>

//             {/* User Profile */}
//             <div className="flex items-center space-x-3">
//               <Button variant="ghost" size="sm" className="p-2">
//                 <Bell className="w-5 h-5" />
//               </Button>
//               <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors">
//                 <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
//                 <div className="hidden sm:block">
//                   <div className="text-sm font-medium">{currentUser.name}</div>
//                   <div className="text-xs text-green-400">Online</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Left Sidebar - Enhanced Profile Card */}
//           <aside className="lg:col-span-3">
//             <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl backdrop-blur-sm">
//               {/* Profile Header */}
//               <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex justify-center relative">
//                 <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-500/10"></div>
//                 <Avatar src={currentUser.avatar} alt={currentUser.name} size="lg" className="relative z-10" />
//               </div>
              
//               {/* Profile Info */}
//               <div className="p-6">
//                 <h2 className="text-xl font-bold text-center mb-1">{currentUser.name}</h2>
//                 <p className="text-gray-400 text-center mb-4 text-sm">{currentUser.role}</p>
                
//                 {/* Enhanced Stats */}
//                 <div className="grid grid-cols-2 gap-3 mb-6">
//                   <div className="bg-gray-700/50 backdrop-blur-sm px-4 py-3 rounded-xl text-center border border-gray-600/50">
//                     <div className="text-lg font-bold text-green-400">{currentUser.networks}</div>
//                     <div className="text-xs text-gray-400">Networks</div>
//                   </div>
//                   <div className="bg-gray-700/50 backdrop-blur-sm px-4 py-3 rounded-xl text-center border border-gray-600/50">
//                     <div className="text-lg font-bold text-blue-400">{currentUser.fans}</div>
//                     <div className="text-xs text-gray-400">Fans</div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="space-y-2">
//                   <Button className="w-full" size="sm">
//                     Edit Profile
//                   </Button>
//                   <Button variant="secondary" className="w-full" size="sm">
//                     View Profile
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* Center - Enhanced Feed */}
//           <section className="lg:col-span-6">
//             {/* Enhanced Post Creation */}
//             <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-6 shadow-xl">
//               <form onSubmit={handlePostSubmit}>
//                 <div className="flex space-x-4">
//                   <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" />
//                   <div className="flex-1">
//                     <textarea
//                       value={postText}
//                       onChange={(e) => setPostText(e.target.value)}
//                       placeholder="What's happening in sports today?"
//                       className="w-full bg-transparent text-lg placeholder-gray-400 border-none focus:outline-none resize-none"
//                       rows="3"
//                       maxLength={280}
//                     />
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="text-sm text-gray-400">
//                         {postText.length}/280
//                       </div>
//                       <Button 
//                         type="submit" 
//                         disabled={!postText.trim() || postText.length > 280}
//                         loading={isPosting}
//                         size="sm"
//                       >
//                         <Send className="w-4 h-4 mr-2" />
//                         Post
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Enhanced Posts */}
//             <div className="space-y-6">
//               {posts.map((post) => (
//                 <article key={post.id} className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
//                   {/* Post Header */}
//                   <header className="flex items-center justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       <Avatar src={post.avatar} alt={post.user} size="md" />
//                       <div>
//                         <div className="flex items-center space-x-2">
//                           <h3 className="font-semibold">{post.user}</h3>
//                           {post.verified && (
//                             <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
//                               <span className="text-white text-xs font-bold">✓</span>
//                             </div>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-400">{post.role} • {formatTimeAgo(post.timestamp)}</p>
//                       </div>
//                     </div>
//                     <Button variant="ghost" size="sm" className="p-2">
//                       <MoreHorizontal className="w-4 h-4" />
//                     </Button>
//                   </header>

//                   {/* Post Content */}
//                   <div className="mb-4">
//                     <p className="text-gray-300 leading-relaxed">{post.content}</p>
//                   </div>

//                   {/* Post Actions */}
//                   <footer className="flex items-center justify-between pt-3 border-t border-gray-700/50">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleLike(post.id)}
//                       className={`space-x-2 ${post.isLiked ? 'text-red-500' : 'text-gray-400'}`}
//                     >
//                       <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
//                       <span className="text-sm">{post.likes}</span>
//                     </Button>
//                     <Button variant="ghost" size="sm" className="space-x-2">
//                       <MessageSquare className="w-4 h-4" />
//                       <span className="text-sm">{post.comments}</span>
//                     </Button>
//                     <Button variant="ghost" size="sm" className="space-x-2">
//                       <span className="text-sm">Share</span>
//                     </Button>
//                   </footer>
//                 </article>
//               ))}
//             </div>
//           </section>

//           {/* Right Sidebar - Enhanced Social Links */}
//           <aside className="lg:col-span-3">
//             <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl">
//               <h3 className="text-lg font-semibold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
//                 Follow Skaots
//               </h3>
//               <div className="space-y-3">
//                 {SOCIAL_LINKS.map((link) => {
//                   const IconComponent = link.icon;
//                   return (
//                     <a
//                       key={link.name}
//                       href={link.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className={`w-full flex items-center space-x-3 ${link.bgColor} rounded-xl px-4 py-3 transition-all duration-200 hover:scale-105 border border-gray-600/30`}
//                     >
//                       <IconComponent className={`w-5 h-5 ${link.color}`} />
//                       <span className="text-gray-300 font-medium">{link.name}</span>
//                     </a>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Trending Topics */}
//             <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl mt-6">
//               <h3 className="text-lg font-semibold mb-4">Trending in Sports</h3>
//               <div className="space-y-3">
//                 {['#Basketball', '#Football', '#Tennis', '#Olympics'].map((tag, index) => (
//                   <div key={tag} className="flex items-center justify-between text-sm">
//                     <span className="text-gray-300">{tag}</span>
//                     <span className="text-gray-500">{Math.floor(Math.random() * 50)}k posts</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </aside>
//         </div>
//       </main>

//       {/* Enhanced Mobile Navigation */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 px-4 py-2 shadow-2xl">
//         <div className="flex justify-around">
//           {NAV_ITEMS.map((item) => {
//             const IconComponent = item.icon;
//             return (
//               <button
//                 key={item.name}
//                 onClick={() => setActiveNav(item.name)}
//                 className={`relative flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
//                   activeNav === item.name
//                     ? 'text-green-400 bg-green-400/10'
//                     : 'text-gray-400'
//                 }`}
//               >
//                 <IconComponent className="w-5 h-5" />
//                 <span className="text-xs font-medium">{item.name}</span>
//                 <Badge count={item.badge} />
//               </button>
//             );
//           })}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default SkaotsPlatform;


import React, { useState, useCallback, useMemo } from 'react';
import { Home, Calendar, Users, MessageSquare, User, ThumbsUp, Youtube, Music, Instagram, Send, MoreHorizontal, Search, Bell } from 'lucide-react';

// Custom hooks for better state management
const useLocalState = (key, initialValue) => {
  const [state, setState] = useState(initialValue);

  const setValue = useCallback((value) => {
    setState(value);
  }, []);

  return [state, setValue];
};

// Component constants
const NAV_ITEMS = [
  { name: 'Home', icon: Home, badge: null },
  { name: 'Events', icon: Calendar, badge: 3 },
  { name: 'Connect', icon: Users, badge: null },
  { name: 'Messages', icon: MessageSquare, badge: 12 }
];

const SOCIAL_LINKS = [
  { 
    name: 'YouTube', 
    icon: Youtube, 
    color: 'text-red-500', 
    bgColor: 'bg-red-500/10 hover:bg-red-500/20',
    url: 'https://youtube.com/skaots'
  },
  { 
    name: 'TikTok', 
    icon: Music, 
    color: 'text-pink-500', 
    bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
    url: 'https://tiktok.com/@skaots'
  },
  { 
    name: 'Instagram', 
    icon: Instagram, 
    color: 'text-purple-500', 
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
    url: 'https://instagram.com/skaots'
  }
];

// Utility components
const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center ring-2 ring-gray-700/50 ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      ) : (
        <User className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-16 h-16'} text-gray-300`} />
      )}
    </div>
  );
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-green-500/25',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};

const Badge = ({ count, className = '' }) => {
  if (!count || count === 0) return null;
  
  return (
    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

// Main component
const SkaotsPlatform = () => {
  const [activeNav, setActiveNav] = useLocalState('activeNav', 'Home');
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useLocalState('posts', [
    {
      id: 1,
      user: 'Lamda Phi',
      role: 'Fan',
      avatar: null,
      timestamp: new Date().toISOString(),
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false
    },
    {
      id: 2,
      user: 'Sunday Oliseh',
      role: 'Basketball Athlete',
      avatar: null,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      likes: 15,
      comments: 3,
      shares: 2,
      isLiked: false,
      verified: true
    }
  ]);

  const [isPosting, setIsPosting] = useState(false);

  // Memoized values
  const currentUser = useMemo(() => ({
    name: 'Kaka Jose',
    role: 'Basketball Player',
    networks: 7,
    fans: 0,
    avatar: null
  }), []);

  // Event handlers
  const handlePostSubmit = useCallback(async () => {
    if (!postText.trim() || isPosting) return;

    setIsPosting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPost = {
      id: Date.now(),
      user: currentUser.name,
      role: currentUser.role,
      avatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      content: postText.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false
    };

    setPosts(prev => [newPost, ...prev]);
    setPostText('');
    setIsPosting(false);
  }, [postText, currentUser, setPosts, isPosting]);

  const handleLike = useCallback((postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  }, [setPosts]);

  const formatTimeAgo = useCallback((timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SK</span>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Skaots..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors text-gray-900"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`relative flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                      activeNav === item.name
                        ? 'text-green-600 bg-green-50 shadow-lg'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.name}</span>
                    <Badge count={item.badge} />
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                  <div className="text-xs text-green-600">Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Enhanced Profile Card */}
          <aside className="lg:col-span-3">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-2xl backdrop-blur-sm">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-500/10"></div>
                <Avatar src={currentUser.avatar} alt={currentUser.name} size="lg" className="relative z-10" />
              </div>
              
              {/* Profile Info */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-center mb-1 text-gray-900">{currentUser.name}</h2>
                <p className="text-gray-600 text-center mb-4 text-sm">{currentUser.role}</p>
                
                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 backdrop-blur-sm px-4 py-3 rounded-xl text-center border border-gray-200">
                    <div className="text-lg font-bold text-green-600">{currentUser.networks}</div>
                    <div className="text-xs text-gray-500">Networks</div>
                  </div>
                  <div className="bg-gray-50 backdrop-blur-sm px-4 py-3 rounded-xl text-center border border-gray-200">
                    <div className="text-lg font-bold text-blue-600">{currentUser.fans}</div>
                    <div className="text-xs text-gray-500">Fans</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="secondary" className="w-full text-white" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Center - Enhanced Feed */}
          <section className="lg:col-span-6">
            {/* Enhanced Post Creation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6 shadow-xl">
              <div>
                <div className="flex space-x-4">
                  <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" />
                  <div className="flex-1">
                    <textarea
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="What's happening in sports today?"
                      className="w-full bg-transparent text-lg placeholder-gray-500 border-none focus:outline-none resize-none text-gray-900"
                      rows="3"
                      maxLength={280}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        {postText.length}/280
                      </div>
                      <Button 
                        onClick={handlePostSubmit}
                        disabled={!postText.trim() || postText.length > 280}
                        loading={isPosting}
                        size="sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                  {/* Post Header */}
                  <header className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar src={post.avatar} alt={post.user} size="md" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{post.user}</h3>
                          {post.verified && (
                            <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{post.role} • {formatTimeAgo(post.timestamp)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </header>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <footer className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`space-x-2 ${post.isLiked ? 'text-red-500' : 'text-gray-500'} hover:bg-gray-50`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="space-x-2 text-gray-500 hover:bg-gray-50">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="space-x-2 text-gray-500 hover:bg-gray-50">
                      <span className="text-sm">Share</span>
                    </Button>
                  </footer>
                </article>
              ))}
            </div>
          </section>

          {/* Right Sidebar - Enhanced Social Links */}
          <aside className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Follow Skaots
              </h3>
              <div className="space-y-3">
                {SOCIAL_LINKS.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-105 border border-gray-200"
                    >
                      <IconComponent className={`w-5 h-5 ${link.color}`} />
                      <span className="text-gray-700 font-medium">{link.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-xl mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Trending in Sports</h3>
              <div className="space-y-3">
                {['#Basketball', '#Football', '#Tennis', '#Olympics'].map((tag, index) => (
                  <div key={tag} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{tag}</span>
                    <span className="text-gray-500">{Math.floor(Math.random() * 50)}k posts</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Enhanced Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-2 shadow-2xl">
        <div className="flex justify-around">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`relative flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  activeNav === item.name
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
                <Badge count={item.badge} />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default SkaotsPlatform;