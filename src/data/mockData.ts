
export const mockProfiles = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: '',
    skills: [
      { name: 'Plumbing', level: 'expert', hourlyRate: 45 },
      { name: 'Electrical', level: 'advanced', hourlyRate: 40 },
    ],
    rating: 4.8,
    reviews: 24,
    isAvailable: true,
    location: 'Brooklyn, NY',
    about: 'I have 5 years of experience as a home maintenance professional, specializing in plumbing and electrical work.',
    reviewDetails: [
      {
        author: 'Maria Garcia',
        rating: 5,
        text: 'Alex did an excellent job fixing our sink. Very professional and knowledgeable.'
      },
      {
        author: 'James Wilson',
        rating: 5,
        text: 'Quick response and great workmanship. Will definitely hire again for electrical work.'
      }
    ]
  },
  {
    id: 2,
    name: 'Maya Rodriguez',
    avatar: '',
    skills: [
      { name: 'Gardening', level: 'expert', hourlyRate: 35 },
      { name: 'Landscaping', level: 'expert', hourlyRate: 50 },
    ],
    rating: 4.9,
    reviews: 31,
    isAvailable: true,
    location: 'Queens, NY',
    about: 'Professional gardener with over 8 years of experience. I specialize in organic gardening, landscaping design, and plant care.',
    reviewDetails: [
      {
        author: 'Thomas Lee',
        rating: 5,
        text: 'Maya transformed our backyard into a beautiful garden. She has amazing vision and knowledge about plants.'
      },
      {
        author: 'Sarah Johnson',
        rating: 5,
        text: 'Very reliable and thorough. Maya took care of our garden while we were away and everything looked perfect when we returned.'
      }
    ]
  },
  {
    id: 3,
    name: 'David Kim',
    avatar: '',
    skills: [
      { name: 'Carpentry', level: 'expert', hourlyRate: 55 },
      { name: 'Furniture Assembly', level: 'advanced', hourlyRate: 40 },
    ],
    rating: 4.7,
    reviews: 18,
    isAvailable: false,
    location: 'Manhattan, NY',
    about: 'Master carpenter with a keen eye for detail. Specializing in custom furniture, cabinets, and woodworking projects of all sizes.',
    reviewDetails: [
      {
        author: 'Emily Chen',
        rating: 5,
        text: 'David built custom bookshelves for my apartment and they are absolutely perfect. Great craftsmanship!'
      },
      {
        author: 'Michael Brown',
        rating: 4,
        text: 'Very skilled carpenter. The work took a bit longer than expected but the quality was worth the wait.'
      }
    ]
  },
  {
    id: 4,
    name: 'Sophia Martinez',
    avatar: '',
    skills: [
      { name: 'Cleaning', level: 'advanced', hourlyRate: 30 },
      { name: 'Organization', level: 'expert', hourlyRate: 35 },
    ],
    rating: 4.9,
    reviews: 42,
    isAvailable: true,
    location: 'Bronx, NY',
    about: 'Professional cleaner and organizer. I help transform cluttered spaces into clean, organized environments.',
    reviewDetails: [
      {
        author: 'Robert Johnson',
        rating: 5,
        text: 'Sophia is a cleaning wizard! My apartment has never looked so spotless.'
      },
      {
        author: 'Jennifer Wilson',
        rating: 5,
        text: 'Incredible organizer. Sophia helped me declutter my entire home and set up systems to keep everything in order.'
      }
    ]
  },
  {
    id: 5,
    name: 'James Wilson',
    avatar: '',
    skills: [
      { name: 'Painting', level: 'expert', hourlyRate: 40 },
      { name: 'Drywall Repair', level: 'advanced', hourlyRate: 45 },
    ],
    rating: 4.6,
    reviews: 15,
    isAvailable: false,
    location: 'Staten Island, NY',
    about: 'Professional painter with expertise in interior and exterior painting, color consultation, and drywall repair.',
    reviewDetails: [
      {
        author: 'Lisa Thompson',
        rating: 5,
        text: 'James painted our entire house and did an amazing job. Clean lines, no mess, and finished on schedule.'
      },
      {
        author: 'Daniel Garcia',
        rating: 4,
        text: 'Great painter and very knowledgeable about different paint types and finishes.'
      }
    ]
  },
  {
    id: 6,
    name: 'Emma Davis',
    avatar: '',
    skills: [
      { name: 'Cooking', level: 'expert', hourlyRate: 40 },
      { name: 'Baking', level: 'expert', hourlyRate: 45 },
    ],
    rating: 5.0,
    reviews: 27,
    isAvailable: true,
    location: 'Brooklyn, NY',
    about: 'Personal chef with culinary school training. I specialize in healthy meal prep, special occasions, and dietary-specific cooking.',
    reviewDetails: [
      {
        author: 'William Chen',
        rating: 5,
        text: 'Emma prepared a dinner party for 8 people at our home and the food was exceptional. Everyone was impressed!'
      },
      {
        author: 'Jessica Miller',
        rating: 5,
        text: 'We hired Emma for weekly meal prep and it has been life-changing. Delicious, healthy meals and great variety.'
      }
    ]
  }
];
