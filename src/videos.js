const videoSections = [
  {
    title: 'Trailers',
    videos: [
      { id: 'tr1', type: 'youtube', title: 'Big Buck Bunny', url: 'https://www.youtube.com/embed/aqz-KE-bpKQ', thumb: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg' },
      { id: 'tr2', type: 'youtube', title: 'New Featured Video', url: 'https://www.youtube.com/embed/Uc9m1G6qYyg', thumb: 'https://img.youtube.com/vi/Uc9m1G6qYyg/hqdefault.jpg' },
      { id: 'tr3', type: 'youtube', title: 'Tears of Steel', url: 'https://www.youtube.com/embed/R6MlUcmOul8', thumb: 'https://img.youtube.com/vi/R6MlUcmOul8/hqdefault.jpg' },
      { id: 'tr4', type: 'youtube', title: 'Caminandes 3: Llama Drama', url: 'https://www.youtube.com/embed/SkVqJ1SGeL0', thumb: 'https://img.youtube.com/vi/SkVqJ1SGeL0/hqdefault.jpg' },
      { id: 'tr5', type: 'youtube', title: 'Cosmos Laundromat', url: 'https://www.youtube.com/embed/Y-rmzh0PI3c', thumb: 'https://img.youtube.com/vi/Y-rmzh0PI3c/hqdefault.jpg' },
      { id: 'tr6', type: 'youtube', title: 'Spring', url: 'https://www.youtube.com/embed/WhWc3b3KhnY', thumb: 'https://img.youtube.com/vi/WhWc3b3KhnY/hqdefault.jpg' },
      { id: 'tr7', type: 'youtube', title: 'Caminandes 2: Gran Dillama', url: 'https://www.youtube.com/embed/9FhMMmqzbD8', thumb: 'https://img.youtube.com/vi/9FhMMmqzbD8/hqdefault.jpg' },
    ],
  },
  {
    title: 'Documentaries',
    videos: [
      { id: 'doc1', type: 'youtube', title: 'Our Planet | Netflix Documentary', url: 'https://www.youtube.com/embed/aETNYyrqNYE', thumb: 'https://img.youtube.com/vi/aETNYyrqNYE/hqdefault.jpg' },
      { id: 'doc2', type: 'youtube', title: 'Planet Earth II | Official Trailer', url: 'https://www.youtube.com/embed/c8aFcHFu8QM', thumb: 'https://img.youtube.com/vi/c8aFcHFu8QM/hqdefault.jpg' },
      { id: 'doc3', type: 'youtube', title: 'The Most Radioactive Places on Earth', url: 'https://www.youtube.com/embed/TRL7o2kPqw0', thumb: 'https://img.youtube.com/vi/TRL7o2kPqw0/hqdefault.jpg' },
      { id: 'doc4', type: 'youtube', title: 'Veritasium: The Map of Mathematics', url: 'https://www.youtube.com/embed/OmJ-4B-mS-Y', thumb: 'https://img.youtube.com/vi/OmJ-4B-mS-Y/hqdefault.jpg' },
      { id: 'doc5', type: 'youtube', title: 'Kurzgesagt: The Egg', url: 'https://www.youtube.com/embed/h6fcK_fRYaI', thumb: 'https://img.youtube.com/vi/h6fcK_fRYaI/hqdefault.jpg' },
      { id: 'doc6', type: 'youtube', title: 'The Social Dilemma | Official Trailer', url: 'https://www.youtube.com/embed/uaaC57tcci0', thumb: 'https://img.youtube.com/vi/uaaC57tcci0/hqdefault.jpg' },
      { id: 'doc7', type: 'youtube', title: 'DAMN', url: 'https://www.youtube.com/embed/Uc9m1G6qYyg', thumb: 'https://img.youtube.com/vi/Uc9m1G6qYyg/hqdefault.jpg' },
    ],
  },
  {
    title: 'Gameplay',
    videos: [
      { id: 'gp1', type: 'youtube', title: 'Minecraft Speedrun World Record', url: 'https://www.youtube.com/embed/4drucg1A6Xk', thumb: 'https://img.youtube.com/vi/4drucg1A6Xk/hqdefault.jpg' },
      { id: 'gp2', type: 'youtube', title: 'Zelda: Breath of the Wild Gameplay', url: 'https://www.youtube.com/embed/1rPxiXXxftE', thumb: 'https://img.youtube.com/vi/1rPxiXXxftE/hqdefault.jpg' },
      { id: 'gp3', type: 'youtube', title: 'Among Us - Funny Moments', url: 'https://www.youtube.com/embed/NSJ4cESNQfE', thumb: 'https://img.youtube.com/vi/NSJ4cESNQfE/hqdefault.jpg' },
      { id: 'gp4', type: 'youtube', title: 'Fortnite Chapter 2 Gameplay', url: 'https://www.youtube.com/embed/2gUtfBmw86Y', thumb: 'https://img.youtube.com/vi/2gUtfBmw86Y/hqdefault.jpg' },
      { id: 'gp5', type: 'youtube', title: 'League of Legends Worlds 2020', url: 'https://www.youtube.com/embed/1Wl1B7DPegc', thumb: 'https://img.youtube.com/vi/1Wl1B7DPegc/hqdefault.jpg' },
      { id: 'gp6', type: 'youtube', title: 'DAMN', url: 'https://www.youtube.com/embed/Uc9m1G6qYyg', thumb: 'https://img.youtube.com/vi/Uc9m1G6qYyg/hqdefault.jpg' },
      { id: 'gp7', type: 'youtube', title: 'DAMN', url: 'https://www.youtube.com/embed/Uc9m1G6qYyg', thumb: 'https://img.youtube.com/vi/Uc9m1G6qYyg/hqdefault.jpg' },
    ],
  },
  {
    title: 'Tutorial',
    videos: [
      { id: 'tu1', type: 'youtube', title: 'How to Use Git and GitHub', url: 'https://www.youtube.com/embed/RGOj5yH7evk', thumb: 'https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg' },
      { id: 'tu2', type: 'youtube', title: 'React JS Crash Course', url: 'https://www.youtube.com/embed/w7ejDZ8SWv8', thumb: 'https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg' },
      { id: 'tu3', type: 'youtube', title: 'Python Tutorial for Beginners', url: 'https://www.youtube.com/embed/_uQrJ0TkZlc', thumb: 'https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg' },
      { id: 'tu4', type: 'youtube', title: 'HTML Full Course - Build a Website', url: 'https://www.youtube.com/embed/pQN-pnXPaVg', thumb: 'https://img.youtube.com/vi/pQN-pnXPaVg/hqdefault.jpg' },
      { id: 'tu5', type: 'youtube', title: 'CSS Crash Course For Beginners', url: 'https://www.youtube.com/embed/yfoY53QXEnI', thumb: 'https://img.youtube.com/vi/yfoY53QXEnI/hqdefault.jpg' },
      { id: 'tu6', type: 'youtube', title: 'JavaScript Tutorial for Beginners', url: 'https://www.youtube.com/embed/W6NZfCO5SIk', thumb: 'https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg' },
      { id: 'tu7', type: 'youtube', title: 'DAMN', url: 'https://www.youtube.com/embed/Uc9m1G6qYyg', thumb: 'https://img.youtube.com/vi/Uc9m1G6qYyg/hqdefault.jpg' },
    ],
  },
  {
    title: 'AI',
    videos: [
      { id: 'ai1', type: 'youtube', title: 'What is Artificial Intelligence?', url: 'https://www.youtube.com/embed/2ePf9rue1Ao', thumb: 'https://img.youtube.com/vi/2ePf9rue1Ao/hqdefault.jpg' },
      { id: 'ai2', type: 'youtube', title: 'How Machines Learn', url: 'https://www.youtube.com/embed/R9OHn5ZF4Uo', thumb: 'https://img.youtube.com/vi/R9OHn5ZF4Uo/hqdefault.jpg' },
      { id: 'ai3', type: 'youtube', title: 'DeepMind: AlphaGo - The Movie', url: 'https://www.youtube.com/embed/WXuK6gekU1Y', thumb: 'https://img.youtube.com/vi/WXuK6gekU1Y/hqdefault.jpg' },
      { id: 'ai4', type: 'youtube', title: 'AI Learns to Play Games', url: 'https://www.youtube.com/embed/tcdVC4e6EV4', thumb: 'https://img.youtube.com/vi/tcdVC4e6EV4/hqdefault.jpg' },
      { id: 'ai5', type: 'youtube', title: 'The Turing Test: Alan Turing', url: 'https://www.youtube.com/embed/3wLqsRLvV-c', thumb: 'https://img.youtube.com/vi/3wLqsRLvV-c/hqdefault.jpg' },
      { id: 'ai6', type: 'youtube', title: 'AI vs Humans: Who Wins?', url: 'https://www.youtube.com/embed/0bMe_vCZo30', thumb: 'https://img.youtube.com/vi/0bMe_vCZo30/hqdefault.jpg' },
      { id: 'ai7', type: 'youtube', title: 'DAMN', url: 'https://www.youtube.com/embed/Uc9m1G6qYyg', thumb: 'https://img.youtube.com/vi/Uc9m1G6qYyg/hqdefault.jpg' },
    ],
  },
  {
    title: 'Coding',
    videos: [
      { id: 'co1', type: 'youtube', title: 'The Coding Train: Coding Challenge', url: 'https://www.youtube.com/embed/HerCR8bw_GE', thumb: 'https://img.youtube.com/vi/HerCR8bw_GE/hqdefault.jpg' },
      { id: 'co2', type: 'youtube', title: 'JavaScript Tutorial for Beginners', url: 'https://www.youtube.com/embed/W6NZfCO5SIk', thumb: 'https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg' },
      { id: 'co3', type: 'youtube', title: 'Python Tutorial for Beginners', url: 'https://www.youtube.com/embed/_uQrJ0TkZlc', thumb: 'https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg' },
      { id: 'co4', type: 'youtube', title: 'React JS Crash Course', url: 'https://www.youtube.com/embed/w7ejDZ8SWv8', thumb: 'https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg' },
      { id: 'co5', type: 'youtube', title: 'HTML Full Course - Build a Website', url: 'https://www.youtube.com/embed/pQN-pnXPaVg', thumb: 'https://img.youtube.com/vi/pQN-pnXPaVg/hqdefault.jpg' },
      { id: 'co6', type: 'youtube', title: 'CSS Crash Course For Beginners', url: 'https://www.youtube.com/embed/yfoY53QXEnI', thumb: 'https://img.youtube.com/vi/yfoY53QXEnI/hqdefault.jpg' },
      { id: 'co7', type: 'youtube', title: 'DAMN', url: 'https://www.youtube.com/embed/Uc9m1G6qYyg', thumb: 'https://img.youtube.com/vi/Uc9m1G6qYyg/hqdefault.jpg' },
    ],
  },
];

export default videoSections; 