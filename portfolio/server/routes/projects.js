const express = require('express');
const router = express.Router();

// Static project data seeded from GitHub pins
// In a real app you could store these in MongoDB and update via admin panel
const projects = [
  {
    id: 1,
    title: 'Projects',
    description: 'A collection of DOM manipulation projects including interactive carts, dynamic UIs, and a portfolio page built from scratch with vanilla JS.',
    githubUrl: 'https://github.com/tonmoybht/Projects',
    liveUrl: null,
    languages: ['HTML', 'CSS', 'JavaScript'],
    icon: '🧩',
    featured: true,
    pinned: true,
    topics: ['dom', 'vanilla-js', 'frontend']
  },
  {
    id: 2,
    title: 'Udemy Course',
    description: 'JavaScript learning exercises and projects from structured Udemy course work — covering fundamentals through modern ES6+ patterns.',
    githubUrl: 'https://github.com/tonmoybht/Udemy-Course',
    liveUrl: null,
    languages: ['JavaScript'],
    icon: '📚',
    featured: true,
    pinned: true,
    topics: ['javascript', 'learning', 'es6']
  },
  {
    id: 3,
    title: 'Interactive Cares',
    description: 'Frontend practice projects built during interactive learning sessions, focusing on UI components and CSS layout techniques.',
    githubUrl: 'https://github.com/tonmoybht/Interactive-Cares',
    liveUrl: null,
    languages: ['HTML', 'CSS'],
    icon: '⚡',
    featured: false,
    pinned: true,
    topics: ['html', 'css', 'ui-components']
  },
  {
    id: 4,
    title: 'Frontend Mentor 3',
    description: 'Pixel-perfect solutions to Frontend Mentor design challenges — professional UI implementations with responsive layouts.',
    githubUrl: 'https://github.com/tonmoybht/FrontendMentor3',
    liveUrl: null,
    languages: ['HTML', 'CSS'],
    icon: '🎯',
    featured: false,
    pinned: true,
    topics: ['frontend-mentor', 'responsive', 'css']
  },
  {
    id: 5,
    title: 'WEB Repo',
    description: 'A web development repository with CSS experiments, layout compositions, and responsive design pattern explorations.',
    githubUrl: 'https://github.com/tonmoybht/WEB-repo',
    liveUrl: null,
    languages: ['CSS', 'HTML'],
    icon: '🌐',
    featured: false,
    pinned: true,
    topics: ['css', 'responsive', 'web']
  },
  {
    id: 6,
    title: 'Foodi — Restaurant Website',
    description: 'A restaurant website template built with Bootstrap. Features menu sections, clean layout, and fully mobile-responsive design.',
    githubUrl: 'https://github.com/prosaberhr/foodi-website',
    liveUrl: null,
    languages: ['HTML', 'Bootstrap'],
    icon: '🍽️',
    featured: true,
    pinned: true,
    topics: ['bootstrap', 'restaurant', 'responsive']
  }
];

// GET /api/projects
router.get('/', (req, res) => {
  const { pinned, featured } = req.query;
  let result = [...projects];
  if (pinned === 'true') result = result.filter(p => p.pinned);
  if (featured === 'true') result = result.filter(p => p.featured);
  res.json({ success: true, count: result.length, data: result });
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
});

module.exports = router;
