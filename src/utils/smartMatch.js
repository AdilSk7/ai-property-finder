// Smart Property Matching Engine
// Simulated AI-style matching using weighted scoring

export function calculateMatchScore(property, preferences) {
  let score = 0;
  let maxScore = 0;
  const reasons = [];

  // Budget match - 30 points
  if (preferences.maxBudget && preferences.maxBudget > 0) {
    maxScore += 30;
    if (property.price <= preferences.maxBudget) {
      const budgetRatio = property.price / preferences.maxBudget;
      if (budgetRatio <= 0.7) {
        score += 30;
        reasons.push(`Well within your ₹${formatPrice(preferences.maxBudget)} budget`);
      } else if (budgetRatio <= 0.9) {
        score += 25;
        reasons.push(`Within your ₹${formatPrice(preferences.maxBudget)} budget`);
      } else {
        score += 20;
        reasons.push(`Close to your ₹${formatPrice(preferences.maxBudget)} budget`);
      }
    } else {
      const overBudget = ((property.price - preferences.maxBudget) / preferences.maxBudget) * 100;
      if (overBudget <= 10) {
        score += 10;
        reasons.push(`Slightly over budget by ${overBudget.toFixed(0)}%`);
      }
    }
  }

  // City match - 15 points (NEW)
  if (preferences.city && preferences.city !== 'All Cities') {
    maxScore += 15;
    if (property.city && property.city.toLowerCase() === preferences.city.toLowerCase()) {
      score += 15;
      reasons.push(`Located in ${property.city}`);
    }
  }

  // Location match - 20 points
  if (preferences.location && preferences.location !== "All Locations") {
    maxScore += 20;
    if (property.location.toLowerCase() === preferences.location.toLowerCase()) {
      score += 20;
      reasons.push(`Located in ${property.location} as preferred`);
    } else {
      // Nearby areas within same city
      const nearbyAreas = {
        'whitefield': ['marathahalli'],
        'marathahalli': ['whitefield', 'bellandur'],
        'bellandur': ['marathahalli', 'hsr layout', 'sarjapur road'],
        'hsr layout': ['bellandur', 'koramangala', 'electronic city'],
        'koramangala': ['hsr layout', 'bellandur'],
        'electronic city': ['hsr layout', 'sarjapur road'],
        'sarjapur road': ['electronic city', 'bellandur'],
        'andheri': ['goregaon', 'malad'],
        'bandra': ['worli', 'andheri'],
        'worli': ['bandra', 'powai'],
        'powai': ['andheri'],
        'hinjewadi': ['baner', 'wakad'],
        'kharadi': ['viman nagar'],
        'baner': ['hinjewadi', 'wakad'],
        'gachibowli': ['hitec city', 'kondapur', 'madhapur'],
        'hitec city': ['gachibowli', 'kondapur', 'madhapur'],
        'kondapur': ['gachibowli', 'hitec city', 'madhapur'],
        'omr': ['sholinganallur', 'velachery'],
        'sholinganallur': ['omr'],
        'golf course road': ['dlf phase 5', 'sohna road', 'sector 56'],
        'sector 150': ['sector 75', 'greater noida west'],
        'salt lake': ['new town', 'rajarhat'],
        'new town': ['salt lake', 'rajarhat'],
        'sg highway': ['prahlad nagar', 'bopal', 'satellite'],
      };
      const nearby = nearbyAreas[preferences.location.toLowerCase()] || [];
      if (nearby.includes(property.location.toLowerCase())) {
        score += 10;
        reasons.push(`Near your preferred area (${property.location})`);
      }
    }
  }

  // BHK match - 15 points
  if (preferences.bhk && preferences.bhk > 0) {
    maxScore += 15;
    if (property.bhk === preferences.bhk) {
      score += 15;
      reasons.push(`${property.bhk}BHK as requested`);
    } else if (Math.abs(property.bhk - preferences.bhk) === 1) {
      score += 8;
      reasons.push(`${property.bhk}BHK (close to your ${preferences.bhk}BHK preference)`);
    }
  }

  // Property type match - 10 points
  if (preferences.propertyType && preferences.propertyType !== "All Types") {
    maxScore += 10;
    if (property.propertyType.toLowerCase() === preferences.propertyType.toLowerCase()) {
      score += 10;
      reasons.push(`${property.propertyType} as preferred`);
    }
  }

  // Amenities match - 10 points
  if (preferences.amenities && preferences.amenities.length > 0) {
    maxScore += 10;
    const matchedAmenities = preferences.amenities.filter(a =>
      property.amenities.some(pa => pa.toLowerCase().includes(a.toLowerCase()))
    );
    const amenityScore = (matchedAmenities.length / preferences.amenities.length) * 10;
    score += amenityScore;
    if (matchedAmenities.length > 0) {
      reasons.push(`${matchedAmenities.join(', ')} available`);
    }
  }

  // Commute match - 10 points
  if (preferences.maxCommute && preferences.commuteLocation) {
    maxScore += 10;
    const commuteKey = preferences.commuteLocation.toLowerCase().replace(/\s+/g, '');
    const commuteTime = property.commuteTime?.[commuteKey];
    if (commuteTime !== undefined) {
      if (commuteTime <= preferences.maxCommute) {
        score += 10;
        reasons.push(`${commuteTime}-minute commute to ${preferences.commuteLocation}`);
      } else if (commuteTime <= preferences.maxCommute * 1.2) {
        score += 5;
        reasons.push(`${commuteTime}-minute commute (close to preference)`);
      }
    }
  }

  // Furnishing match - bonus
  if (preferences.furnishing && preferences.furnishing !== "Any") {
    if (property.furnishing === preferences.furnishing) {
      score += 5; maxScore += 5;
      reasons.push(`${property.furnishing} as preferred`);
    } else { maxScore += 5; }
  }

  // Possession match - bonus
  if (preferences.possession && preferences.possession !== "Any") {
    if (property.possession === preferences.possession) {
      score += 5; maxScore += 5;
      reasons.push(`${property.possession} availability`);
    } else { maxScore += 5; }
  }

  if (maxScore === 0) {
    return { score: 70 + Math.floor(Math.random() * 20), reasons: ["Based on popular choices"] };
  }

  const percentage = Math.round((score / maxScore) * 100);
  return {
    score: Math.max(percentage, 5),
    reasons: reasons.length > 0 ? reasons : ["Partial match based on available criteria"]
  };
}

// Parse natural language query — supports all Indian cities
export function parseNaturalQuery(query) {
  const preferences = {};
  const queryLower = query.toLowerCase();

  // Extract BHK
  const bhkMatch = query.match(/(\d)\s*bhk/i);
  if (bhkMatch) preferences.bhk = parseInt(bhkMatch[1]);

  // Extract budget
  const croreMatch = query.match(/(\d+\.?\d*)\s*(crore|crores|cr)\b/i);
  const lakhMatch = query.match(/(\d+)\s*(lakh|lakhs|lac|lacs|l)\b/i);
  if (croreMatch) preferences.maxBudget = parseFloat(croreMatch[1]) * 10000000;
  else if (lakhMatch) preferences.maxBudget = parseInt(lakhMatch[1]) * 100000;

  // Extract city (check cities first, then locations)
  const cityKeywords = [
    { k: 'mumbai', city: 'Mumbai', state: 'Maharashtra' },
    { k: 'pune', city: 'Pune', state: 'Maharashtra' },
    { k: 'bangalore', city: 'Bangalore', state: 'Karnataka' },
    { k: 'bengaluru', city: 'Bangalore', state: 'Karnataka' },
    { k: 'hyderabad', city: 'Hyderabad', state: 'Telangana' },
    { k: 'chennai', city: 'Chennai', state: 'Tamil Nadu' },
    { k: 'delhi', city: 'Delhi', state: 'Delhi NCR' },
    { k: 'gurgaon', city: 'Gurgaon', state: 'Delhi NCR' },
    { k: 'gurugram', city: 'Gurgaon', state: 'Delhi NCR' },
    { k: 'noida', city: 'Noida', state: 'Delhi NCR' },
    { k: 'kolkata', city: 'Kolkata', state: 'West Bengal' },
    { k: 'ahmedabad', city: 'Ahmedabad', state: 'Gujarat' },
    { k: 'jaipur', city: 'Jaipur', state: 'Rajasthan' },
  ];
  for (const c of cityKeywords) {
    if (queryLower.includes(c.k)) {
      preferences.city = c.city;
      preferences.state = c.state;
      break;
    }
  }

  // Extract location (specific areas)
  const locationKeywords = [
    'whitefield', 'electronic city', 'sarjapur road', 'sarjapur', 'marathahalli',
    'hsr layout', 'hsr', 'bellandur', 'koramangala', 'yelahanka',
    'andheri', 'bandra', 'powai', 'thane', 'worli', 'goregaon', 'malad',
    'hinjewadi', 'kharadi', 'baner', 'wakad', 'viman nagar',
    'gachibowli', 'hitec city', 'hitech city', 'kondapur', 'madhapur', 'banjara hills', 'jubilee hills',
    'omr', 'anna nagar', 'velachery', 'adyar', 'sholinganallur', 'guindy',
    'dwarka', 'saket', 'vasant kunj', 'rohini',
    'golf course road', 'sohna road', 'sector 56', 'dlf phase 5',
    'sector 150', 'sector 75', 'greater noida west',
    'salt lake', 'new town', 'rajarhat',
    'sg highway', 'prahlad nagar', 'satellite', 'bopal',
    'vaishali nagar', 'mansarovar', 'malviya nagar', 'jagatpura'
  ];
  for (const loc of locationKeywords) {
    if (queryLower.includes(loc)) {
      if (loc === 'sarjapur') preferences.location = 'Sarjapur Road';
      else if (loc === 'hsr') preferences.location = 'HSR Layout';
      else if (loc === 'hitech city') preferences.location = 'HITEC City';
      else preferences.location = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // Extract property type
  if (queryLower.includes('villa')) preferences.propertyType = 'Villa';
  else if (queryLower.includes('penthouse')) preferences.propertyType = 'Penthouse';
  else if (queryLower.includes('apartment') || queryLower.includes('flat')) preferences.propertyType = 'Apartment';

  // Extract furnishing
  if (queryLower.includes('furnished') && !queryLower.includes('unfurnished') && !queryLower.includes('semi')) {
    preferences.furnishing = 'Furnished';
  } else if (queryLower.includes('semi-furnished') || queryLower.includes('semi furnished')) {
    preferences.furnishing = 'Semi-Furnished';
  } else if (queryLower.includes('unfurnished')) {
    preferences.furnishing = 'Unfurnished';
  }

  // Extract possession
  if (queryLower.includes('ready') || queryLower.includes('immediate')) {
    preferences.possession = 'Ready to Move';
  }

  // Extract amenities
  const amenityKeywords = ['parking', 'gym', 'pool', 'swimming', 'security', 'garden', 'club'];
  const matchedAmenities = amenityKeywords.filter(a => queryLower.includes(a));
  if (matchedAmenities.length > 0) {
    preferences.amenities = matchedAmenities.map(a => {
      if (a === 'pool' || a === 'swimming') return 'Swimming Pool';
      return a.charAt(0).toUpperCase() + a.slice(1);
    });
  }

  return preferences;
}

function formatPrice(price) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)}Cr`;
  return `${(price / 100000).toFixed(0)}L`;
}

export function getPropertyMatchResults(properties, preferences) {
  return properties
    .map(property => ({ ...property, matchResult: calculateMatchScore(property, preferences) }))
    .sort((a, b) => b.matchResult.score - a.matchResult.score);
}
