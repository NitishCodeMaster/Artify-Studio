import img1 from '../assets/Images/PerformerPanel/image1.jpeg';
import img2 from '../assets/Images/ArtistSpotlight/dancer.avif';

import eventImg1 from '../assets/Images/PerformerPanel/image1.jpeg';
import eventImg2 from '../assets/Images/ArtistSpotlight/dancer.avif';
import eventImg3 from '../assets/Images/ArtistSpotlight/painter.avif';

export const featuredEvents = [
    {
        id: 1,
        title: "Neon Jazz Festival '25",
        artist: "The Midnight Quartet",
        date: "Dec 24, 2025",
        time: "8:00 PM",
        location: "Mumbai Arena, BKC",
        price: "₹1,499",
        image: eventImg1,
        color: "from-purple-500 to-indigo-600"
    },
    {
        id: 2,
        title: "Sufi Night Live",
        artist: "Rahat & Band",
        date: "Jan 10, 2026",
        time: "7:30 PM",
        location: "Lodhi Gardens, Delhi",
        price: "₹2,999",
        image: eventImg2,
        color: "from-orange-500 to-red-600"
    },
    {
        id: 3,
        title: "Abstract Art Expo",
        artist: "Global Artists Union",
        date: "Feb 05, 2026",
        time: "10:00 AM",
        location: "UB City, Bangalore",
        price: "Free Entry",
        image: eventImg3,
        color: "from-emerald-500 to-teal-600"
    },
];

export const gigOpportunities = [
    {
        id: 1,
        role: "Lead Vocalist",
        venue: "Hard Rock Cafe",
        location: "Pune, KP",
        pay: "₹12k/gig",
        type: "Singing",
        matchScore: 94,
        verified: true,
        tags: ["Rock", "Pop"],
        deadline: "2 Days Left"
    },
    {
        id: 2,
        role: "Ghazal Artist",
        venue: "Taj Hotels",
        location: "Mumbai",
        pay: "₹25k/night",
        type: "Classical",
        matchScore: 88,
        verified: true,
        tags: ["Ghazal", "Premium"],
        deadline: "Urgent"
    },
    {
        id: 3,
        role: "Jazz Drummer",
        venue: "Piano Man",
        location: "Delhi",
        pay: "₹8k/hr",
        type: "Instrumental",
        matchScore: 67,
        verified: false,
        tags: ["Jazz", "Drums"],
        deadline: "1 Week Left"
    }
];

export const upcomingEvents = [
    {
        id: 101,
        title: "Sunburn Arena",
        artist: "Martin Garrix",
        date: "24 Dec",
        price: "₹1,500",
        image: img1,
        location: "Mumbai"
    },
    {
        id: 102,
        title: "Sufi Night",
        artist: "Bismil ki Mehfil",
        date: "10 Jan",
        price: "₹2,000",
        image: img2,
        location: "Delhi"
    }
];

export const artistStats = [
    { label: "Active Gigs", value: "450+", icon: "mic", color: "text-indigo-400" },
    { label: "Avg. Pay", value: "₹15k", icon: "dollar", color: "text-emerald-400" },
    { label: "Organizers", value: "120+", icon: "users", color: "text-purple-400" }
];