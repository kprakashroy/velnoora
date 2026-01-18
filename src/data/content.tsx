import _ from 'lodash';
import { BiSupport } from 'react-icons/bi';
import { FiTruck } from 'react-icons/fi';
import { TiClipboard } from 'react-icons/ti';

import type { NavItemType } from '@/components/NavItem';

import type { BlogType } from './types';

const ncNanoId = _.uniqueId;

const otherPageChildMenus: NavItemType[] = [
  {
    id: ncNanoId(),
    href: '/',
    name: 'Home',
  },
  {
    id: ncNanoId(),
    href: '/checkout',
    name: 'Checkout',
  },
  {
    id: ncNanoId(),
    href: '/contact',
    name: 'Contact Us',
  },
  {
    id: ncNanoId(),
    href: '/cart',
    name: 'Cart',
  },
  {
    id: ncNanoId(),
    href: '/products',
    name: 'Collections',
    type: 'dropdown',
    children: [
      {
        id: ncNanoId(),
        href: '/products',
        name: 'Collections',
      },
      {
        id: ncNanoId(),
        href: '/products/sweat-outfit',
        name: 'Product Single',
      },
    ],
  },
  {
    id: ncNanoId(),
    href: '/',
    name: 'Utility Pages',
    type: 'dropdown',
    children: [
      {
        id: ncNanoId(),
        href: '/faqs',
        name: 'FAQS',
      },
      {
        id: ncNanoId(),
        href: '/gg',
        name: '404 not found',
      },
      {
        id: ncNanoId(),
        href: '/signup',
        name: 'Signup',
      },
      {
        id: ncNanoId(),
        href: '/login',
        name: 'Login',
      },
      {
        id: ncNanoId(),
        href: '/forgot-pass',
        name: 'Forgot Password',
      },
    ],
  },
  {
    id: ncNanoId(),
    href: '/blog',
    name: 'Blog Pages',
    type: 'dropdown',
    children: [
      {
        id: ncNanoId(),
        href: '/blog',
        name: 'Blog Page',
      },
      {
        id: ncNanoId(),
        href: '/blog/chic-sleek-latest-trends-fashion-wonderland',
        name: 'Blog Single',
      },
    ],
  },
];

export const NavLinks: NavItemType[] = [
  {
    id: ncNanoId(),
    name: 'Home',
    href: '/',
  },
  // {
  //   id: ncNanoId(),
  //   name: 'Blog',
  //   href: '/blog',
  // },
  {
    id: ncNanoId(),
    name: 'Pages',
    href: '/',
    type: 'dropdown',
    children: otherPageChildMenus,
  },
  {
    id: ncNanoId(),
    name: 'Collections',
    href: '/products',
  },
  {
    id: ncNanoId(),
    name: 'Contact',
    href: '/contact',
  },
];

export const headerSection = {
  title: 'TRENDY FASHION ZONE',
  heading: 'We Always Build Stunning Fashion Experiences',
};

export const newItemsData = [
  {
    coverImage:
      'https://images.unsplash.com/photo-1515121240746-1fc801ba75a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8',
    title: 'New Collection',
    year: 2023,
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1440288736878-766bd5839edb?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Kids Collection',
    year: null,
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=1438&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Women Style',
    year: null,
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1610384104075-e05c8cf200c3?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Best fits',
    year: 2023,
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Trending',
    year: null,
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1596609548086-85bbf8ddb6b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8',
    title: 'Season 10',
    year: null,
  },
];

export const midText =
  'Browse through our carefully carted collection of high-quality clothing & accessories featuring the latest trends and style';

export const products = [
  {
    slug: 'pakistani-suit',
    coverImage: '/suit.jpeg',
    productName: 'Brown Coat',
    price: 159,
    reviews: 45,
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!',
    shots: ['/suit.jpeg', '/suit.jpeg', '/suit.jpeg', '/suit.jpeg'],
  },
  {
    slug: 'sweat-outfit',
    coverImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww',
    productName: 'Sweat Outfit',
    price: 129,
    reviews: 45,
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!',
    shots: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1512101903502-7eb0c9022c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    slug: 'sweat-shirt',
    coverImage:
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    productName: 'Sweat Shirt',
    price: 299,
    reviews: 45,
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!',
    shots: [
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1512101903502-7eb0c9022c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    slug: 'black-t-shirt',
    coverImage:
      'https://images.unsplash.com/photo-1503342250614-ca440786f637?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    productName: 'Black T-shirt',
    price: 169,
    reviews: 45,
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!',
    shots: [
      'https://images.unsplash.com/photo-1503342250614-ca440786f637?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1512101903502-7eb0c9022c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    slug: 'black-hoodie',
    coverImage:
      'https://images.unsplash.com/photo-1633292587737-f898a032e562?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
    productName: 'Black Hoodie',
    price: 139,
    reviews: 45,
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!',
    shots: [
      'https://images.unsplash.com/photo-1633292587737-f898a032e562?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1512101903502-7eb0c9022c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    slug: 'yellow-glases',
    coverImage:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww',
    productName: 'Yellow Glasses',
    price: 159,
    reviews: 45,
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!',
    shots: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1512101903502-7eb0c9022c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
];

export const profilesPhotos = [
  'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1930&q=80',
  'https://images.unsplash.com/photo-1584999734482-0361aecad844?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
];

export const promoSection = {
  heading: 'Style Is A Way To Say Who You Are Without Having To Speak',
  promoTitle: 'Get 29% Off This Holiday Season Using The Code',
  photo:
    'https://images.unsplash.com/photo-1565288971009-a6db8844c687?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OXw5OTUwNDc1fHxlbnwwfHx8fHw%3D',
  review: {
    quote: `"Clothes and manners do not make the man; but when he is made, they greatly improve his appearance."`,
    reviewer: 'Arthur Ashe',
  },
};

export const footerData = {
  footerLinks: [
    {
      title: 'Main Pages',
      links: [
        { href: '/', name: 'Home' },
        { href: '/products', name: 'Collections' },
        { href: '/cart', name: 'Cart' },
        { href: '/checkout', name: 'Checkout' },
        { href: '/blog', name: 'Blogs' },
        {
          href: '/blog/the-evolution-of-sneaker-culture-a-historical-perspective',
          name: 'Blog Single',
        },
        { href: '/collections/yellowLow', name: 'Product Single' },
      ],
    },
    {
      title: 'Utility Pages',
      links: [
        { href: '/contact', name: 'Contact' },
        { href: '/forgot-pass', name: 'Forgot Password' },
        { href: '/login', name: 'Login' },
        { href: '/signup', name: 'Signup' },
        { href: '/faq', name: 'FAQS' },
        { href: '/rt', name: 'Not Found' },
      ],
    },
  ],
};

export const newsletter = {
  heading: 'Newsletter',
  description:
    'Get the latest news about us and sign up and get 20% off today. Never miss a single promo',
};

export const sizes = ['XS', 'S', 'M', 'L', 'XL'];

export const note =
  ' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae, est eum magnam doloremque, at adipisci debitis, similique dolores ipsa unde necessitatibus vero quibusdam nostrum numquam!';

export const contactSection = {
  title: 'contact us',
  heading: 'How may we help you',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis quis phasellus eleifend tellus orci ornare.',
  directContactInfo: [
    {
      icon: <BiSupport className="text-3xl" />,
      title: 'Order',
      contactLink: {
        href: 'mailto:order@luxloom.com',
        title: 'order@luxloom.com',
      },
    },
    {
      icon: <FiTruck className="text-3xl" />,
      title: 'Start a Return',
      contactLink: {
        href: 'mailto:return@luxloom.com',
        title: 'return@luxloom.com',
      },
    },
    {
      icon: <TiClipboard className="text-3xl" />,
      title: 'Sizing and Product Info',
      contactLink: {
        href: 'mailto:products@luxloom.com',
        title: 'products@luxloom.com',
      },
    },
  ],
};

export const faqsData = {
  heading: 'Frequently Asked Questions',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget adipiscing nibh nunc. Velit rhoncus arcu velesaed.',
  faqs: [
    {
      category: 'Shipping & Delivery',
      data: [
        {
          question: 'How can I track my order?',
          answer:
            'You can track your order by logging into your account and checking the order status. Additionally, a tracking number will be provided in the shipping confirmation email.',
        },
        {
          question: 'What is the estimated delivery time for my order?',
          answer:
            'Delivery times vary based on your location. Typically, domestic orders take 3-5 business days, while international orders may take 7-14 business days.',
        },
        {
          question: 'Can I change my shipping address after placing an order?',
          answer:
            'Unfortunately, we cannot change the shipping address once the order is placed. Please double-check your information before completing the purchase.',
        },
        {
          question: 'Do you offer expedited shipping options?',
          answer:
            'Yes, we offer expedited shipping at an additional cost. You can choose your preferred shipping method during the checkout process.',
        },
        {
          question: 'What should I do if my order is delayed or lost?',
          answer:
            'If your order is significantly delayed or lost, please contact our customer support team, and we will investigate the issue.',
        },
      ],
    },
    {
      category: 'Warranty & Repair',
      data: [
        {
          question: 'How do I determine the right size for my sneakers?',
          answer:
            'Refer to our size chart available on the product page. It provides measurements and guidelines to help you choose the correct size.',
        },
        {
          question: 'Are your sneakers authentic?',
          answer:
            'Yes, we guarantee the authenticity of all our sneakers. We source them directly from authorized retailers and reputable suppliers.',
        },
        {
          question: "Can I return or exchange my sneakers if they don't fit?",
          answer:
            'Yes, we have a hassle-free return policy. You can return or exchange unworn sneakers within 30 days of receiving your order.',
        },
        {
          question: 'Are the colors of the sneakers accurate in the photos?',
          answer:
            'We strive to provide accurate color representation, but slight variations may occur due to monitor settings. Refer to product descriptions for additional details.',
        },
        {
          question: 'Do you restock sold-out sneakers?',
          answer:
            'We restock popular styles based on demand. You can sign up for notifications to be informed when a specific product is back in stock.',
        },
      ],
    },
    {
      category: 'Payments & Safety',
      data: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept major credit cards, PayPal, and other secure payment methods. You can view the full list during the checkout process.',
        },
        {
          question: 'How can I apply a discount code to my order?',
          answer:
            'Enter your discount code in the designated field during checkout. The discount will be applied to your total before payment.',
        },
        {
          question: 'Can I modify or cancel my order after payment?',
          answer:
            'Once an order is placed, it cannot be modified or canceled. Please review your order carefully before completing the purchase.',
        },
        {
          question: 'Is my payment information secure?',
          answer:
            'Yes, we use industry-standard encryption to secure your payment information. Your data is protected and never stored on our servers.',
        },
        {
          question: 'Do you offer gift cards?',
          answer:
            'Yes, we offer gift cards of various denominations. They make great presents for sneaker enthusiasts!',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      data: [
        {
          question: 'How do I initiate a return or exchange?',
          answer:
            'Visit the "Returns & Exchanges" page on our website, follow the instructions, and submit a request. Our team will guide you through the process.',
        },
        {
          question: 'What is your return policy for defective products?',
          answer:
            'If you receive a defective product, please contact our customer support within 7 days of receiving the order. We will arrange a replacement or refund.',
        },
        {
          question: 'Are there any restocking fees for returns?',
          answer:
            'We do not charge restocking fees for returns. However, please review our return policy for specific details.',
        },
        {
          question: 'How long does it take to process a refund?',
          answer:
            'Refunds are typically processed within 5-7 business days after we receive the returned items and verify their condition.',
        },
        {
          question: "Can I return sneakers if I've worn them?",
          answer:
            'We only accept returns for unworn sneakers. Please try them on in a clean, indoor environment to ensure they are the right fit before wearing them outside.',
        },
      ],
    },
  ],
};

const demoBlogData = {
  sectionOne: {
    title:
      'Can you share insights into the evolution of chic and sleek styles in the fashion industry?',
    paragraph1:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    points: [
      'Pretium nibh ipsum consequat nisl vel pretium. Sed vulputate mi sit',
      'Tristique nulla aliquet enim tortor at auctor urna. Sit amet aliquam id diam maer  dolore eu fugiat nulla pariatur',
      'Nam libero justo laoreet sit amet. Lacus sed viverra tellus in hac',
      'Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis',
    ],
    paragraph2:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
  },
  sectionTwo: {
    title:
      'What distinguishes the latest trends featured in the "Fashion Wonderland" from previous seasons?',
    description:
      'Augue lacus viverra vitae congue eu consequat ac felis donec. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Morbi tristique senectus et netus et malesuada fames ac turpis. Iaculis eu non diam phasellus vestibulum lorem sed.',
    midImage:
      'https://images.unsplash.com/photo-1464490826362-59825a4f51df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8',
    midImageTwo:
      'https://images.unsplash.com/photo-1502163140606-888448ae8cfe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  sectionThree: {
    title:
      'How can individuals incorporate chic and sleek elements into their everyday wardrobes?',
    description:
      'Augue lacus viverra vitae congue eu consequat ac felis donec. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Morbi tristique senectus et netus et malesuada fames ac turpis. Iaculis eu non diam phasellus vestibulum lorem sed.',
  },
  sectionFour: {
    title:
      'Which fashion influencers or celebrities have embraced the chic and sleek trends showcased?',
    description:
      'Bibendum at varius vel pharetra vel turpis nunc. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc. Volutpat est velit egestas dui id ornare.',
    points: [
      'Pretium nibh ipsum consequat nisl vel pretium. Sed vulputate mi sit',
      'Tristique nulla aliquet enim tortor at auctor urna. Sit amet aliquam id diam maer  dolore eu fugiat nulla pariatur',
      'Nam libero justo laoreet sit amet. Lacus sed viverra tellus in hac',
      'Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis',
    ],
  },
  quote:
    '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor porta rhoncus, viverra sit et auctor. Augue in volutpat sed eget in etiam.”',
  sectionFive: [
    {
      title:
        'What materials or fabrics are emphasized in creating the chic and sleek look?',
      description:
        'Tincidunt nunc pulvinar sapien et ligula. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Aliquet bibendum enim facilisis gravida neque convallis a cras. Molestie nunc non blandit massa enim nec dui nunc.',
    },
    {
      title:
        'How does the collection cater to diverse fashion preferences and body types?',
      description:
        'Tincidunt nunc pulvinar sapien et ligula. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Aliquet bibendum enim facilisis gravida neque convallis a cras. Molestie nunc non blandit massa enim nec dui nunc.',
    },
  ],
};

export const blogs: BlogType[] = [
  {
    title:
      'Chic and Sleek: Unveiling the Latest Trends in Our Fashion Wonderland',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'chic-sleek-latest-trends-fashion-wonderland',
  },
  {
    title: 'Runway to Your Wardrobe: Must-Have Styles from Our Fall Collection',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Trend',
    slug: 'runway-wardrobe-must-have-styles-fall-collection',
  },
  {
    title: 'Dress to Impress: Elevate Your Fashion Game with Our New Arrivals',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Outfit',
    slug: 'dress-impress-elevate-fashion-game-new-arrivals',
  },
  {
    title: 'Accessorize Your Life: The Ultimate Guide to Statement Pieces',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'accessorize-life-ultimate-guide-statement-pieces',
  },
  {
    title:
      'Effortless Elegance: Mastering Everyday Glamour with Our Essentials',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Trend',
    slug: 'effortless-elegance-mastering-everyday-glamour-essentials',
  },
  {
    title: 'Fashion Forward: Uncovering the Hottest Looks of the Season',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'General',
    slug: 'fashion-forward-uncovering-hottest-looks-season',
  },
  {
    title:
      'Sustainable Style: Embrace Eco-Friendly Fashion Finds in Our Collection',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'sustainable-style-embrace-eco-friendly-fashion-finds',
  },
  {
    title: "Dapper Duds: Men's Fashion Picks for a Stylish Wardrobe Upgrade",
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1459&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Outfit',
    slug: 'dapper-duds-mens-fashion-picks-stylish-wardrobe',
  },
  {
    title: 'Fierce and Fabulous: Channel Your Inner Diva with Our Bold Apparel',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1546548729-375ff057ec22?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Style',
    slug: 'fierce-fabulous-channel-inner-diva-bold-apparel',
  },
  {
    title:
      'The Art of Mix and Match: Create Endless Outfit Possibilities with Our Versatile Pieces',
    brief:
      'Lorem ipsum dolor sit amet, lormol amenrtol consectetur adipiscing elit, sed do eiusmod tempor.',
    date: 'October 2, 2022',
    coverImage:
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    blogData: demoBlogData,
    tag: 'Trend',
    slug: 'art-mix-match-create-endless-outfit-possibilities-versatile-pieces',
  },
];

export const productsCollection = {
  heading: 'Collections',
  description:
    'Lorem ipsum dolor sit amet consectetur adipiscing elit facilisi pellentesque cursus eget morbi sagittis sagittis.',
};
