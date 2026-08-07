import { Twitter, Instagram, Github, Mail, MapPin, Phone } from 'lucide-react';

export const footerData = {
    about: "Artify Studio is a premier platform for artists to showcase talent, find mentorship, and trade instruments in a vibrant community.",
    quickLinks: [
        { name: "Explore Gallery", path: "/discover" },
        { name: "Live Events", path: "/events" },
        { name: "Marketplace", path: "/marketplace" },
        { name: "Learning Hub", path: "/learn" }
    ],
    support: [
        { name: "Help Center", path: "/help" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Contact Us", path: "/contact" }
    ],
    contact: [
        { icon: <MapPin size={18} />, detail: "Delhi, India" },
        { icon: <Phone size={18} />, detail: "+91 9523043234" },
        { icon: <Mail size={18} />, detail: "support@artify.com" }
    ],
    socials: [
        {
            icon: <Instagram size={18} />,
            link: "https://instagram.com/artify",
            color: "#E1306C" 
        },
        {
            icon: <Twitter size={18} />,
            link: "https://twitter.com/artify",
            color: "#1DA1F2" 
        },
        {
            icon: <Github size={18} />,
            link: "https://github.com/nitish",
            color: "#ffffff" 
        }
    ],
};