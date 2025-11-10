import React, { useEffect, useState } from 'react';
import { Users, MapPin, Trophy, MessageCircle, Search, Filter, Star } from 'lucide-react';

const SportsConnect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
   const [selectedState, setSelectedState] = useState('all');


//  const [countries, setCountries] = useState([]);

//   useEffect(() => {
//     fetch("https://restcountries.com/v3.1/all?fields=name,capital,flags")
//       .then((res) => res.json())
//       .then((data) => setCountries(data))
//       .catch((err) => console.error(err));
//   }, []);

// console.log(countries)

  const profiles = [
    {
      id: 1,
      name: 'Micheal Jose',
      role: 'Football Player',
      sport: 'football',
      location: 'Lagos, Nigeria',
      rating: 4.8,
      connections: 156,
      image: '/api/placeholder/150/150',
      verified: true,
      experience: '5+ years',
      achievements: ['State Championship Winner', 'Team Captain']
    },
    {
      id: 2,
      name: 'Sunday Oliseh',
      role: 'Basketball Player',
      sport: 'basketball',
      location: 'Abu, South Africa',
      rating: 4.9,
      connections: 203,
      image: '/api/placeholder/150/150',
      verified: true,
      experience: '7+ years',
      achievements: ['National Team Member', 'MVP 2023']
    },
    {
      id: 3,
      name: 'Eric Denilson',
      role: 'Sporting Coach',
      sport: 'football',
      location: 'Lamat, Ghana',
      rating: 4.7,
      connections: 89,
      image: '/api/placeholder/150/150',
      verified: false,
      experience: '3+ years',
      achievements: ['Youth Development Specialist', 'CAF Licensed']
    },
    {
      id: 4,
      name: 'Alex Faragan',
      role: 'Sporting Lagos Coach',
      sport: 'basketball',
      location: 'Lagos, Nigeria',
      rating: 4.6,
      connections: 124,
      image: '/api/placeholder/150/150',
      verified: true,
      experience: '4+ years',
      achievements: ['Regional Champion', 'Skills Development Expert']
    }
  ];

  const sports = [
    { value: 'all', label: 'All Sports' },
    { value: 'football', label: 'Football' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'athletics', label: 'Athletics' }
  ];

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'player', label: 'Player' },
    { value: 'coach', label: 'Coach' },
    { value: 'referee', label: 'Referee' },
    { value: 'manager', label: 'Manager' }
  ];

  // const location = [
  //    { value: 'all', label: 'All Countries' },
  //   { value: 'Nigeria', label: 'Nigeria' },
  //   { value: 'South Africa', label: 'South Africa' },
  //   { value: 'Lybia', label: 'Lybia' }
  // ];

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'all' || profile.sport === selectedSport;
    const matchesRole = selectedRole === 'all' || 
                       profile.role.toLowerCase().includes(selectedRole.toLowerCase());
  //  const matchesLocation = selectedState === 'all' || 
  //                      profile.location.toLowerCase().includes(selectedState.toLowerCase());  
    
    return matchesSearch && matchesSport && matchesRole;
  });

  const ProfileCard = ({ profile }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-xl"></div>
        {/* {profile.verified && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full p-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        )} */}
      </div>
      
      <div className="p-4 sm:p-6 -mt-12 sm:-mt-16 relative">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <Users size={24} className="text-gray-500 sm:w-8 sm:h-8" />
          </div>
        </div>
        
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 leading-tight">{profile.name}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-2">{profile.role}</p>
          
          <div className="flex items-center justify-center mb-2">
            <MapPin size={14} className="text-gray-400 mr-1" />
            <span className="text-xs sm:text-sm text-gray-500">{profile.location}</span>
          </div>
          
          <div className="flex items-center justify-center mb-3 text-xs sm:text-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
            <span className="text-gray-600 ml-1">{profile.rating}</span>
            <span className="text-gray-400 mx-2">•</span>
            <Users size={14} className="text-gray-400" />
            <span className="text-gray-600 ml-1">{profile.connections}</span>
          </div>
        </div>
        
        <div className="mb-3 sm:mb-4">
          <div className="flex flex-wrap gap-1 justify-center">
            {profile.achievements.slice(0, 2).map((achievement, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full truncate max-w-full">
                {achievement}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center">
            <Users size={14} className="mr-1 sm:mr-2" />
            <span className="truncate">Connect</span>
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-2.5 sm:px-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <MessageCircle size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Connect with Athletes & Coaches
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover and connect with sports professionals in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4">
            {/* Search - Full width on mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, role, sport , country or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm border placeholder:text-gray-900 text-[12px] sm:text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters - Stacked on mobile, side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sport Filter */}
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="py-2.5 sm:py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {sports.map(sport => (
                  <option key={sport.value} value={sport.value}>{sport.label}</option>
                ))}
              </select>
              
              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="py-2.5 sm:py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>

              {/* State Filter */}
              {/* <div>
<select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="py-2.5 sm:py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {location.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
              </div> */}
              
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'Professional' : 'Professionals'} Found
          </h2>
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 self-start sm:self-auto">
            <Filter size={16} className="mr-1" />
            Sort by: Relevance
          </button>
        </div>

        {/* Profile Grid - Responsive grid with better mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProfiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* Load More Button */}
        {filteredProfiles.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 w-full sm:w-auto">
              Load More Professionals
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <Users size={40} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">No professionals found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more results
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSport('all');
                setSelectedRole('all');
                setSelectedState('all');
              }}
              className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SportsConnect;