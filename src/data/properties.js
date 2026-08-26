// Indian States → Cities → Locations hierarchy
export const statesData = {
  'All States': {},
  'Karnataka': {
    cities: ['Bangalore'],
    locations: {
      'Bangalore': ['Whitefield', 'Electronic City', 'Sarjapur Road', 'Marathahalli', 'HSR Layout', 'Bellandur', 'Koramangala', 'Yelahanka']
    }
  },
  'Maharashtra': {
    cities: ['Mumbai', 'Pune'],
    locations: {
      'Mumbai': ['Andheri', 'Bandra', 'Powai', 'Thane', 'Worli', 'Goregaon', 'Malad'],
      'Pune': ['Hinjewadi', 'Kharadi', 'Baner', 'Wakad', 'Viman Nagar']
    }
  },
  'Telangana': {
    cities: ['Hyderabad'],
    locations: {
      'Hyderabad': ['Gachibowli', 'HITEC City', 'Kondapur', 'Madhapur', 'Banjara Hills', 'Jubilee Hills']
    }
  },
  'Tamil Nadu': {
    cities: ['Chennai'],
    locations: {
      'Chennai': ['OMR', 'Anna Nagar', 'Velachery', 'Adyar', 'Sholinganallur', 'Guindy']
    }
  },
  'Delhi NCR': {
    cities: ['Delhi', 'Gurgaon', 'Noida'],
    locations: {
      'Delhi': ['Dwarka', 'Saket', 'Vasant Kunj', 'Rohini', 'Janakpuri'],
      'Gurgaon': ['Golf Course Road', 'Sohna Road', 'Sector 56', 'DLF Phase 5', 'MG Road Gurgaon'],
      'Noida': ['Sector 150', 'Sector 75', 'Greater Noida West', 'Sector 137']
    }
  },
  'West Bengal': {
    cities: ['Kolkata'],
    locations: {
      'Kolkata': ['Salt Lake', 'New Town', 'Rajarhat', 'Alipore', 'EM Bypass']
    }
  },
  'Gujarat': {
    cities: ['Ahmedabad'],
    locations: {
      'Ahmedabad': ['SG Highway', 'Prahlad Nagar', 'Satellite', 'Bopal', 'South Bopal']
    }
  },
  'Rajasthan': {
    cities: ['Jaipur'],
    locations: {
      'Jaipur': ['Vaishali Nagar', 'Mansarovar', 'Malviya Nagar', 'Jagatpura', 'Ajmer Road']
    }
  },
  'Andhra Pradesh': {
    cities: ['Vijayawada', 'Visakhapatnam', 'Tirupati', 'Nellore'],
    locations: {
      'Vijayawada': ['Benz Circle', 'Kanuru', 'Gannavaram', 'Poranki'],
      'Visakhapatnam': ['Madhurawada', 'Rushikonda', 'MVP Colony', 'Gajuwaka'],
      'Tirupati': ['Alipiri', 'Renigunta Road', 'Mangalam', 'Tiruchanur'],
      'Nellore': ['Magunta Layout', 'Dargamitta', 'Haranathapuram', 'Vedayapalem', 'Kovur']
    }
  }
};

// Flattened lists for dropdowns
export const states = Object.keys(statesData);

export const getAllCities = () => {
  const cities = ['All Cities'];
  Object.values(statesData).forEach(s => {
    if (s.cities) cities.push(...s.cities);
  });
  return cities;
};

export const getCitiesForState = (state) => {
  if (!state || state === 'All States') return getAllCities();
  return ['All Cities', ...(statesData[state]?.cities || [])];
};

export const getLocationsForCity = (city) => {
  if (!city || city === 'All Cities') {
    const all = ['All Locations'];
    Object.values(statesData).forEach(s => {
      if (s.locations) Object.values(s.locations).forEach(locs => all.push(...locs));
    });
    return all;
  }
  for (const s of Object.values(statesData)) {
    if (s.locations && s.locations[city]) {
      return ['All Locations', ...s.locations[city]];
    }
  }
  return ['All Locations'];
};

export const locations = [
  'All Locations',
  'Whitefield', 'Electronic City', 'Sarjapur Road', 'Marathahalli', 'HSR Layout', 'Bellandur', 'Koramangala', 'Yelahanka',
  'Andheri', 'Bandra', 'Powai', 'Thane', 'Worli', 'Goregaon', 'Malad',
  'Hinjewadi', 'Kharadi', 'Baner', 'Wakad', 'Viman Nagar',
  'Gachibowli', 'HITEC City', 'Kondapur', 'Madhapur', 'Banjara Hills', 'Jubilee Hills',
  'OMR', 'Anna Nagar', 'Velachery', 'Adyar', 'Sholinganallur', 'Guindy',
  'Dwarka', 'Saket', 'Vasant Kunj', 'Rohini',
  'Golf Course Road', 'Sohna Road', 'Sector 56', 'DLF Phase 5',
  'Sector 150', 'Sector 75', 'Greater Noida West',
  'Salt Lake', 'New Town', 'Rajarhat',
  'SG Highway', 'Prahlad Nagar', 'Satellite', 'Bopal',
  'Vaishali Nagar', 'Mansarovar', 'Malviya Nagar', 'Jagatpura',
  'Benz Circle', 'Kanuru', 'Gannavaram', 'Poranki',
  'Madhurawada', 'Rushikonda', 'MVP Colony', 'Gajuwaka',
  'Alipiri', 'Renigunta Road', 'Mangalam', 'Tiruchanur',
  'Magunta Layout', 'Dargamitta', 'Haranathapuram', 'Vedayapalem', 'Kovur'
];

export const propertyTypes = ['All Types', 'Apartment', 'Villa', 'Penthouse'];

export const bhkOptions = [
  { label: 'Any BHK', value: 0 },
  { label: '1 BHK', value: 1 },
  { label: '2 BHK', value: 2 },
  { label: '3 BHK', value: 3 },
  { label: '4 BHK', value: 4 }
];

export const budgetRanges = [
  { label: 'Any Budget', min: 0, max: Infinity },
  { label: 'Under ₹50L', min: 0, max: 5000000 },
  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { label: '₹1Cr - ₹1.5Cr', min: 10000000, max: 15000000 },
  { label: '₹1.5Cr - ₹2Cr', min: 15000000, max: 20000000 },
  { label: 'Above ₹2Cr', min: 20000000, max: Infinity }
];

export const furnishingOptions = ['Any', 'Furnished', 'Semi-Furnished', 'Unfurnished'];
export const possessionOptions = ['Any', 'Ready to Move', 'Under Construction'];

export const amenitiesList = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Club House',
  "Children's Play Area", 'Jogging Track', 'Power Backup', 'Concierge',
  'Smart Home', 'EV Charging', 'Spa', 'Tennis Court', 'Private Garden',
  'Home Theatre', 'Rooftop Garden'
];

// ── DUMMY PROPERTY DATA ──
export const properties = [
  // ─── BANGALORE (Karnataka) ───
  {
    id: 1, name: "Prestige Lakeside Habitat", location: "Whitefield", city: "Bangalore", state: "Karnataka",
    price: 8500000, priceFormatted: "₹85L", bhk: 2, area: 1180, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "7th of 14", facing: "East",
    description: "A stunning 2BHK apartment in the heart of Whitefield with panoramic lake views. This modern residence features spacious rooms, premium fixtures, and world-class amenities. Walking distance to IT parks and shopping malls.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Children's Play Area", "Landscaped Gardens", "Power Backup"],
    nearbyLandmarks: ["ITPL - 2 km", "Phoenix Marketcity - 3 km", "Forum Mall - 4 km", "Whitefield Metro - 1.5 km"],
    commuteTime: { whitefield: 5, electronicCity: 45, koramangala: 30, mgRoad: 25 },
    images: ["property1_1"], colorAccent: "#4F46E5", yearBuilt: 2022, developer: "Prestige Group"
  },
  {
    id: 2, name: "Brigade Metropolis", location: "Whitefield", city: "Bangalore", state: "Karnataka",
    price: 9200000, priceFormatted: "₹92L", bhk: 2, area: 1250, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "12th of 20", facing: "North-East",
    description: "Luxury 2BHK apartment in Brigade Metropolis, one of Whitefield's most prestigious addresses. Features include Italian marble flooring, modular kitchen, and smart home automation.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Tennis Court", "Jogging Track", "Spa", "Power Backup", "Club House"],
    nearbyLandmarks: ["ITPL - 3 km", "Brookefield Mall - 2 km", "International Airport - 30 km"],
    commuteTime: { whitefield: 8, electronicCity: 50, koramangala: 35, mgRoad: 30 },
    images: ["property2_1"], colorAccent: "#7C3AED", yearBuilt: 2021, developer: "Brigade Group"
  },
  {
    id: 3, name: "Sobha Dream Acres", location: "Electronic City", city: "Bangalore", state: "Karnataka",
    price: 5500000, priceFormatted: "₹55L", bhk: 2, area: 1050, propertyType: "Apartment",
    furnishing: "Unfurnished", possession: "Ready to Move", floor: "4th of 12", facing: "South",
    description: "Affordable luxury 2BHK in Electronic City by Sobha Developers. Perfect for IT professionals working in Electronic City.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Jogging Track", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Infosys Campus - 3 km", "Wipro Campus - 2 km", "Electronic City Metro - 1 km"],
    commuteTime: { whitefield: 50, electronicCity: 5, koramangala: 25, mgRoad: 30 },
    images: ["property3_1"], colorAccent: "#059669", yearBuilt: 2023, developer: "Sobha Developers"
  },
  {
    id: 4, name: "Mantri Serenity", location: "Sarjapur Road", city: "Bangalore", state: "Karnataka",
    price: 11500000, priceFormatted: "₹1.15Cr", bhk: 3, area: 1650, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "9th of 16", facing: "West",
    description: "Spacious 3BHK apartment on Sarjapur Road with excellent connectivity. Features a large balcony with garden views.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Basketball Court", "Meditation Hall", "Library", "Power Backup"],
    nearbyLandmarks: ["Wipro Sarjapur - 2 km", "Total Mall - 3 km", "Sarjapur Lake - 1 km"],
    commuteTime: { whitefield: 35, electronicCity: 20, koramangala: 15, mgRoad: 20 },
    images: ["property4_1"], colorAccent: "#DC2626", yearBuilt: 2020, developer: "Mantri Developers"
  },
  {
    id: 5, name: "Purva Zenium", location: "HSR Layout", city: "Bangalore", state: "Karnataka",
    price: 12000000, priceFormatted: "₹1.2Cr", bhk: 3, area: 1750, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Under Construction", floor: "15th of 25", facing: "East",
    description: "Ultra-luxury 3BHK in HSR Layout with sky lounge access. Floor-to-ceiling windows with city skyline views.",
    amenities: ["Infinity Pool", "Gym", "Parking", "Security", "Sky Lounge", "Home Theatre", "Yoga Deck", "EV Charging", "Power Backup", "Concierge"],
    nearbyLandmarks: ["HSR BDA Complex - 1 km", "Agara Lake - 2 km", "Silk Board Junction - 3 km"],
    commuteTime: { whitefield: 30, electronicCity: 18, koramangala: 8, mgRoad: 12 },
    images: ["property5_1"], colorAccent: "#0891B2", yearBuilt: 2025, developer: "Puravankara"
  },
  {
    id: 6, name: "Prestige Shantiniketan", location: "Whitefield", city: "Bangalore", state: "Karnataka",
    price: 15000000, priceFormatted: "₹1.5Cr", bhk: 3, area: 2100, propertyType: "Villa",
    furnishing: "Furnished", possession: "Ready to Move", floor: "Ground + 1", facing: "North",
    description: "Exquisite 3BHK villa in Prestige Shantiniketan, Whitefield's most iconic address. Features private garden, premium interiors, and exclusive villa club access.",
    amenities: ["Private Garden", "Swimming Pool", "Gym", "Parking", "Security", "Club House", "Golf Course", "Spa", "Concierge", "Power Backup"],
    nearbyLandmarks: ["ITPL - 4 km", "SAP Labs - 3 km", "Phoenix Marketcity - 5 km"],
    commuteTime: { whitefield: 10, electronicCity: 55, koramangala: 35, mgRoad: 30 },
    images: ["property6_1"], colorAccent: "#B45309", yearBuilt: 2019, developer: "Prestige Group"
  },
  {
    id: 7, name: "Tata Promont", location: "Koramangala", city: "Bangalore", state: "Karnataka",
    price: 13500000, priceFormatted: "₹1.35Cr", bhk: 3, area: 1900, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "18th of 22", facing: "South-West",
    description: "Premium 3BHK apartment in Koramangala with breathtaking city views. Walking distance to restaurants and pubs.",
    amenities: ["Infinity Pool", "Gym", "Parking", "Security", "Rooftop Lounge", "Mini Theatre", "Library", "Yoga Room", "Power Backup", "Concierge"],
    nearbyLandmarks: ["Forum Mall - 1 km", "Koramangala 4th Block - 0.5 km", "Sony World Junction - 2 km"],
    commuteTime: { whitefield: 25, electronicCity: 20, koramangala: 2, mgRoad: 8 },
    images: ["property7_1"], colorAccent: "#4338CA", yearBuilt: 2021, developer: "Tata Housing"
  },
  {
    id: 8, name: "Total Environment Pursuit", location: "Koramangala", city: "Bangalore", state: "Karnataka",
    price: 22000000, priceFormatted: "₹2.2Cr", bhk: 4, area: 3200, propertyType: "Penthouse",
    furnishing: "Furnished", possession: "Ready to Move", floor: "20th of 20", facing: "All Sides",
    description: "Ultra-luxury 4BHK penthouse in Koramangala with 360-degree city views. Private terrace, jacuzzi, wine cellar, and smart home automation.",
    amenities: ["Private Terrace", "Jacuzzi", "Wine Cellar", "Infinity Pool", "Gym", "Parking", "Security", "Concierge", "Smart Home", "Power Backup"],
    nearbyLandmarks: ["Forum Mall - 0.5 km", "Koramangala 5th Block - 0.3 km", "MG Road - 5 km"],
    commuteTime: { whitefield: 28, electronicCity: 22, koramangala: 1, mgRoad: 7 },
    images: ["property8_1"], colorAccent: "#991B1B", yearBuilt: 2020, developer: "Total Environment"
  },

  // ─── MUMBAI (Maharashtra) ───
  {
    id: 9, name: "Lodha The Park", location: "Worli", city: "Mumbai", state: "Maharashtra",
    price: 35000000, priceFormatted: "₹3.5Cr", bhk: 3, area: 1850, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "28th of 65", facing: "West",
    description: "Iconic sea-facing 3BHK apartment in Worli with stunning Arabian Sea views. World-class amenities by Lodha Group, Mumbai's most prestigious address.",
    amenities: ["Infinity Pool", "Gym", "Parking", "Security", "Spa", "Concierge", "Club House", "Power Backup", "Smart Home"],
    nearbyLandmarks: ["Bandra-Worli Sea Link - 1 km", "Lower Parel - 2 km", "Haji Ali - 3 km"],
    commuteTime: { worli: 0, bandra: 10, andheri: 25, powai: 35 },
    images: ["property9_1"], colorAccent: "#0EA5E9", yearBuilt: 2021, developer: "Lodha Group"
  },
  {
    id: 10, name: "Oberoi Realty Sky City", location: "Andheri", city: "Mumbai", state: "Maharashtra",
    price: 18000000, priceFormatted: "₹1.8Cr", bhk: 2, area: 1100, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "35th of 50", facing: "North",
    description: "Premium 2BHK in Andheri with panoramic city views. Connected to metro and major highways. Oberoi's signature craftsmanship.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Jogging Track", "Club House", "EV Charging", "Power Backup"],
    nearbyLandmarks: ["Andheri Metro - 0.5 km", "SEEPZ IT Park - 2 km", "Mumbai Airport - 4 km"],
    commuteTime: { worli: 25, bandra: 12, andheri: 0, powai: 15 },
    images: ["property10_1"], colorAccent: "#6366F1", yearBuilt: 2022, developer: "Oberoi Realty"
  },
  {
    id: 11, name: "Hiranandani Heritage", location: "Powai", city: "Mumbai", state: "Maharashtra",
    price: 14500000, priceFormatted: "₹1.45Cr", bhk: 2, area: 1050, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "12th of 18", facing: "East",
    description: "Elegant 2BHK in Powai's iconic Hiranandani complex. Lake-facing with lush green surroundings. Close to IIT Bombay and major IT companies.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Tennis Court", "Jogging Track", "Power Backup"],
    nearbyLandmarks: ["IIT Bombay - 1 km", "Powai Lake - 0.5 km", "Hiranandani Gardens - 0 km"],
    commuteTime: { worli: 30, bandra: 20, andheri: 12, powai: 0 },
    images: ["property11_1"], colorAccent: "#14B8A6", yearBuilt: 2020, developer: "Hiranandani"
  },

  // ─── PUNE (Maharashtra) ───
  {
    id: 12, name: "Blue Ridge Township", location: "Hinjewadi", city: "Pune", state: "Maharashtra",
    price: 7200000, priceFormatted: "₹72L", bhk: 2, area: 1100, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "6th of 14", facing: "East",
    description: "Spacious 2BHK in Hinjewadi IT corridor. Walking distance to Rajiv Gandhi Infotech Park. Perfect for IT professionals.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Jogging Track", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Rajiv Gandhi IT Park - 1 km", "Hinjewadi Phase 3 - 2 km", "Xion Mall - 3 km"],
    commuteTime: { hinjewadi: 3, kharadi: 35, baner: 20, vimanNagar: 30 },
    images: ["property12_1"], colorAccent: "#F97316", yearBuilt: 2022, developer: "Paranjape Schemes"
  },
  {
    id: 13, name: "Panchshil Towers", location: "Kharadi", city: "Pune", state: "Maharashtra",
    price: 9500000, priceFormatted: "₹95L", bhk: 3, area: 1450, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "14th of 22", facing: "South",
    description: "Luxury 3BHK in Kharadi EON Free Zone area. Premium fittings, spacious balconies, and resort-style living by Panchshil.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Spa", "Concierge", "Rooftop Garden", "Power Backup"],
    nearbyLandmarks: ["EON Free Zone - 1 km", "World Trade Center - 2 km", "Aga Khan Palace - 5 km"],
    commuteTime: { hinjewadi: 30, kharadi: 2, baner: 25, vimanNagar: 10 },
    images: ["property13_1"], colorAccent: "#8B5CF6", yearBuilt: 2023, developer: "Panchshil Realty"
  },

  // ─── HYDERABAD (Telangana) ───
  {
    id: 14, name: "My Home Bhooja", location: "Gachibowli", city: "Hyderabad", state: "Telangana",
    price: 11000000, priceFormatted: "₹1.1Cr", bhk: 3, area: 1800, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "10th of 20", facing: "North-East",
    description: "Premium 3BHK in the heart of Gachibowli near Financial District. Excellent connectivity to HITEC City and Outer Ring Road.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Tennis Court", "Jogging Track", "EV Charging", "Power Backup"],
    nearbyLandmarks: ["Financial District - 2 km", "DLF Cyber City - 3 km", "IKEA Hyderabad - 4 km"],
    commuteTime: { gachibowli: 0, hitecCity: 10, kondapur: 8, jubileeHills: 15 },
    images: ["property14_1"], colorAccent: "#EC4899", yearBuilt: 2022, developer: "My Home Group"
  },
  {
    id: 15, name: "Aparna Sarovar Grande", location: "Kondapur", city: "Hyderabad", state: "Telangana",
    price: 7800000, priceFormatted: "₹78L", bhk: 2, area: 1200, propertyType: "Apartment",
    furnishing: "Unfurnished", possession: "Ready to Move", floor: "5th of 16", facing: "West",
    description: "Modern 2BHK with lake-facing views in Kondapur. Close to IT corridor and international schools. Vastu-compliant design.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Children's Play Area", "Power Backup", "Jogging Track"],
    nearbyLandmarks: ["HITEC City - 3 km", "Botanical Garden - 2 km", "Kondapur Bus Stand - 0.5 km"],
    commuteTime: { gachibowli: 8, hitecCity: 5, kondapur: 0, jubileeHills: 12 },
    images: ["property15_1"], colorAccent: "#22C55E", yearBuilt: 2021, developer: "Aparna Constructions"
  },
  {
    id: 16, name: "Jayabheri The Peak", location: "Madhapur", city: "Hyderabad", state: "Telangana",
    price: 25000000, priceFormatted: "₹2.5Cr", bhk: 4, area: 3500, propertyType: "Penthouse",
    furnishing: "Furnished", possession: "Ready to Move", floor: "22nd of 22", facing: "All Sides",
    description: "Ultra-luxury 4BHK penthouse in Madhapur with panoramic city views. Private terrace, home theatre, and sky garden.",
    amenities: ["Private Terrace", "Home Theatre", "Infinity Pool", "Gym", "Parking", "Security", "Concierge", "Spa", "Smart Home", "Power Backup"],
    nearbyLandmarks: ["Inorbit Mall - 1 km", "Cyber Towers - 2 km", "ISB Hyderabad - 5 km"],
    commuteTime: { gachibowli: 5, hitecCity: 3, kondapur: 5, jubileeHills: 10 },
    images: ["property16_1"], colorAccent: "#A855F7", yearBuilt: 2023, developer: "Jayabheri Group"
  },

  // ─── CHENNAI (Tamil Nadu) ───
  {
    id: 17, name: "DLF Garden City", location: "OMR", city: "Chennai", state: "Tamil Nadu",
    price: 6800000, priceFormatted: "₹68L", bhk: 2, area: 1100, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "8th of 15", facing: "East",
    description: "Well-designed 2BHK on IT Expressway (OMR). Close to major tech parks and schools. DLF's quality living in Chennai.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Children's Play Area", "Jogging Track", "Power Backup"],
    nearbyLandmarks: ["Tidel Park - 5 km", "Sholinganallur Junction - 2 km", "OMR Food Street - 1 km"],
    commuteTime: { omr: 0, annaNagar: 30, velachery: 15, guindy: 20 },
    images: ["property17_1"], colorAccent: "#E11D48", yearBuilt: 2022, developer: "DLF Limited"
  },
  {
    id: 18, name: "Prestige Courtyards", location: "Sholinganallur", city: "Chennai", state: "Tamil Nadu",
    price: 5200000, priceFormatted: "₹52L", bhk: 2, area: 980, propertyType: "Apartment",
    furnishing: "Unfurnished", possession: "Ready to Move", floor: "3rd of 10", facing: "North",
    description: "Affordable 2BHK near Sholinganallur IT park. Compact design with modern amenities. Best value in Chennai's IT corridor.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup", "Jogging Track"],
    nearbyLandmarks: ["TCS Siruseri - 3 km", "Sholinganallur Signal - 0.5 km", "ECR Beach - 6 km"],
    commuteTime: { omr: 5, annaNagar: 35, velachery: 12, guindy: 22 },
    images: ["property18_1"], colorAccent: "#0D9488", yearBuilt: 2023, developer: "Prestige Group"
  },

  // ─── DELHI NCR ───
  {
    id: 19, name: "DLF The Crest", location: "Golf Course Road", city: "Gurgaon", state: "Delhi NCR",
    price: 28000000, priceFormatted: "₹2.8Cr", bhk: 3, area: 2500, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "22nd of 30", facing: "South",
    description: "Ultra-premium 3BHK on Golf Course Road, Gurgaon. Floor-to-ceiling windows, imported marble, Central AC. DLF's finest luxury offering.",
    amenities: ["Infinity Pool", "Gym", "Parking", "Security", "Concierge", "Spa", "Club House", "Private Garden", "Smart Home", "Power Backup"],
    nearbyLandmarks: ["Cyber Hub - 2 km", "Ambience Mall - 3 km", "HUDA City Centre Metro - 4 km"],
    commuteTime: { gurgaon: 5, delhi: 30, noida: 50, airport: 20 },
    images: ["property19_1"], colorAccent: "#D97706", yearBuilt: 2021, developer: "DLF Limited"
  },
  {
    id: 20, name: "Godrej Aria", location: "Sector 150", city: "Noida", state: "Delhi NCR",
    price: 9500000, priceFormatted: "₹95L", bhk: 3, area: 1600, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Under Construction", floor: "12th of 25", facing: "North-East",
    description: "Modern 3BHK in Sector 150 Noida with Yamuna Expressway connectivity. Upcoming metro connectivity and excellent capital appreciation potential.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Jogging Track", "Children's Play Area", "EV Charging", "Power Backup"],
    nearbyLandmarks: ["Noida Film City - 5 km", "Sector 18 Market - 15 km", "Botanical Garden Metro - 12 km"],
    commuteTime: { gurgaon: 60, delhi: 35, noida: 10, airport: 50 },
    images: ["property20_1"], colorAccent: "#16A34A", yearBuilt: 2025, developer: "Godrej Properties"
  },
  {
    id: 21, name: "ATS Le Grandiose", location: "Sector 150", city: "Noida", state: "Delhi NCR",
    price: 7500000, priceFormatted: "₹75L", bhk: 2, area: 1200, propertyType: "Apartment",
    furnishing: "Unfurnished", possession: "Ready to Move", floor: "8th of 18", facing: "East",
    description: "Elegant 2BHK in Noida Sector 150 with resort-style living. Expansive greens, water bodies, and premium clubhouse.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Tennis Court", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Noida Expressway - 2 km", "Supertech Shoprix - 3 km", "Sector 137 Metro - 8 km"],
    commuteTime: { gurgaon: 55, delhi: 30, noida: 8, airport: 45 },
    images: ["property21_1"], colorAccent: "#2563EB", yearBuilt: 2022, developer: "ATS Group"
  },

  // ─── KOLKATA (West Bengal) ───
  {
    id: 22, name: "Merlin 5th Avenue", location: "Salt Lake", city: "Kolkata", state: "West Bengal",
    price: 6200000, priceFormatted: "₹62L", bhk: 2, area: 1050, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "7th of 14", facing: "South",
    description: "Modern 2BHK in Salt Lake Sector V IT hub. Walking distance to offices, restaurants, and City Centre. Perfect for working professionals.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Power Backup"],
    nearbyLandmarks: ["Salt Lake Sector V IT Hub - 0.5 km", "City Centre - 2 km", "Nicco Park - 3 km"],
    commuteTime: { saltLake: 0, newTown: 10, rajarhat: 12, park: 20 },
    images: ["property22_1"], colorAccent: "#C026D3", yearBuilt: 2022, developer: "Merlin Group"
  },
  {
    id: 23, name: "Tata Avenida", location: "New Town", city: "Kolkata", state: "West Bengal",
    price: 8500000, priceFormatted: "₹85L", bhk: 3, area: 1450, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "10th of 18", facing: "North",
    description: "Premium 3BHK by Tata Housing in New Town Kolkata. Smart living with premium finishes and world-class amenities near Eco Park.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Spa", "Jogging Track", "EV Charging", "Power Backup"],
    nearbyLandmarks: ["Eco Park - 1 km", "Axis Mall - 3 km", "New Town Bus Stand - 0.5 km"],
    commuteTime: { saltLake: 8, newTown: 0, rajarhat: 5, park: 25 },
    images: ["property23_1"], colorAccent: "#0F766E", yearBuilt: 2023, developer: "Tata Housing"
  },

  // ─── AHMEDABAD (Gujarat) ───
  {
    id: 24, name: "Adani Shantigram", location: "SG Highway", city: "Ahmedabad", state: "Gujarat",
    price: 6500000, priceFormatted: "₹65L", bhk: 2, area: 1150, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "5th of 12", facing: "West",
    description: "Well-designed 2BHK on SG Highway in Adani's renowned Shantigram township. International school, hospital, and club within the township.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Jogging Track", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["SG Highway Junction - 1 km", "GIFT City - 10 km", "Ahmedabad Airport - 12 km"],
    commuteTime: { sgHighway: 0, prahladNagar: 10, satellite: 15, bopal: 8 },
    images: ["property24_1"], colorAccent: "#EA580C", yearBuilt: 2022, developer: "Adani Realty"
  },

  // ─── JAIPUR (Rajasthan) ───
  {
    id: 25, name: "Mahima Florenza", location: "Vaishali Nagar", city: "Jaipur", state: "Rajasthan",
    price: 4500000, priceFormatted: "₹45L", bhk: 2, area: 1000, propertyType: "Apartment",
    furnishing: "Unfurnished", possession: "Ready to Move", floor: "4th of 10", facing: "East",
    description: "Affordable luxury 2BHK in Vaishali Nagar, Jaipur's most sought-after residential area. Close to markets, schools, and hospitals.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Vaishali Nagar Metro - 0.5 km", "WTP Mall - 2 km", "SMS Hospital - 5 km"],
    commuteTime: { vaishaliNagar: 0, mansarovar: 15, malviyaNagar: 12, airport: 18 },
    images: ["property25_1"], colorAccent: "#65A30D", yearBuilt: 2023, developer: "Mahima Group"
  },
  // ─── ANDHRA PRADESH ───

  // ─── VIJAYAWADA ───
  {
    id: 26,
    name: "Vijaya Elite Residency", location: "Benz Circle", city: "Vijayawada", state: "Andhra Pradesh",
    price: 7800000, priceFormatted: "₹78L", bhk: 2, area: 1250, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "6th of 12", facing: "East",
    description: "Modern 2BHK apartment near Benz Circle with excellent connectivity to major commercial areas, schools and hospitals.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Benz Circle - 1 km", "Andhra Hospital - 2 km", "Vijayawada Railway Station - 5 km"],
    commuteTime: { benzCircle: 3, kanuru: 10, gannavaram: 25, poranki: 15 },
    images: ["property26_1"], colorAccent: "#2563EB", yearBuilt: 2023, developer: "Vijaya Developers"
  },

  {
    id: 27,
    name: "Kanuru Green Meadows", location: "Kanuru", city: "Vijayawada", state: "Andhra Pradesh",
    price: 9500000, priceFormatted: "₹95L", bhk: 3, area: 1650, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "9th of 15", facing: "North-East",
    description: "Premium 3BHK apartment in Kanuru with spacious interiors, modern amenities and excellent connectivity to the city.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Jogging Track", "Power Backup"],
    nearbyLandmarks: ["Kanuru Main Road - 1 km", "Benz Circle - 4 km", "Vijayawada Airport - 18 km"],
    commuteTime: { benzCircle: 10, kanuru: 2, gannavaram: 20, poranki: 8 },
    images: ["property27_1"], colorAccent: "#059669", yearBuilt: 2024, developer: "Green Meadows Developers"
  },

  // ─── VISAKHAPATNAM ───
  {
    id: 28,
    name: "Beach View Heights", location: "MVP Colony", city: "Visakhapatnam", state: "Andhra Pradesh",
    price: 12000000, priceFormatted: "₹1.2Cr", bhk: 3, area: 1800, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "10th of 18", facing: "East",
    description: "Premium sea-facing 3BHK apartment in MVP Colony with spacious balconies and excellent access to the beach and city.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Power Backup", "Rooftop Garden"],
    nearbyLandmarks: ["RK Beach - 3 km", "Visakhapatnam Port - 6 km", "MVP Double Road - 1 km"],
    commuteTime: { mvpColony: 3, madhurawada: 20, gajuwaka: 35, beachRoad: 8 },
    images: ["property28_1"], colorAccent: "#0891B2", yearBuilt: 2023, developer: "Coastal Developers"
  },

  {
    id: 29,
    name: "Madhurawada Sky Gardens", location: "Madhurawada", city: "Visakhapatnam", state: "Andhra Pradesh",
    price: 6800000, priceFormatted: "₹68L", bhk: 2, area: 1180, propertyType: "Apartment",
    furnishing: "Unfurnished", possession: "Under Construction", floor: "8th of 16", facing: "West",
    description: "Modern 2BHK apartment in the fast-growing Madhurawada area with excellent future investment potential.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Madhurawada IT Hub - 2 km", "Rushikonda Beach - 8 km", "GITAM University - 6 km"],
    commuteTime: { mvpColony: 20, madhurawada: 3, gajuwaka: 40, beachRoad: 25 },
    images: ["property29_1"], colorAccent: "#7C3AED", yearBuilt: 2025, developer: "Skyline Developers"
  },

  // ─── NELLORE ───
  {
    id: 30,
    name: "Nellore Grand Residency", location: "Magunta Layout", city: "Nellore", state: "Andhra Pradesh",
    price: 6200000, priceFormatted: "₹62L", bhk: 2, area: 1200, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "5th of 10", facing: "East",
    description: "Comfortable and modern 2BHK apartment in Magunta Layout, close to major schools, hospitals and shopping areas.",
    amenities: ["Gym", "Parking", "Security", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Magunta Layout - 1 km", "Nellore Railway Station - 4 km", "Narayana Hospital - 3 km"],
    commuteTime: { maguntaLayout: 3, dargamitta: 8, stonehousepet: 10, kavali: 50 },
    images: ["property30_1"], colorAccent: "#DC2626", yearBuilt: 2023, developer: "Nellore Builders"
  },

  {
    id: 31,
    name: "Dargamitta Royal Homes", location: "Dargamitta", city: "Nellore", state: "Andhra Pradesh",
    price: 8500000, priceFormatted: "₹85L", bhk: 3, area: 1650, propertyType: "Apartment",
    furnishing: "Furnished", possession: "Ready to Move", floor: "7th of 12", facing: "North",
    description: "Premium 3BHK residence in Dargamitta with elegant interiors, spacious rooms and convenient city connectivity.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Power Backup"],
    nearbyLandmarks: ["Dargamitta Main Road - 1 km", "Nellore Bus Stand - 3 km", "KVR Petrol Bunk - 2 km"],
    commuteTime: { maguntaLayout: 8, dargamitta: 2, stonehousepet: 12, kavali: 55 },
    images: ["property31_1"], colorAccent: "#EA580C", yearBuilt: 2024, developer: "Royal Homes"
  },

  // ─── TIRUPATI ───
  {
    id: 32,
    name: "Tirupati Golden Residency", location: "Tiruchanur", city: "Tirupati", state: "Andhra Pradesh",
    price: 7000000, priceFormatted: "₹70L", bhk: 2, area: 1250, propertyType: "Apartment",
    furnishing: "Semi-Furnished", possession: "Ready to Move", floor: "6th of 11", facing: "East",
    description: "Modern 2BHK apartment in Tiruchanur with peaceful surroundings and excellent connectivity to major Tirupati locations.",
    amenities: ["Gym", "Parking", "Security", "Children's Play Area", "Power Backup"],
    nearbyLandmarks: ["Padmavathi Temple - 2 km", "Tirupati Railway Station - 5 km", "Airport - 12 km"],
    commuteTime: { tiruchanur: 3, alipiri: 15, renigunta: 20, tirupati: 8 },
    images: ["property32_1"], colorAccent: "#B45309", yearBuilt: 2023, developer: "Golden Developers"
  }

];
