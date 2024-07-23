const passportCountries = [
  { "name": "Afghanistan", "code": "AFG", "full_name": "Islamic Republic of Afghanistan" },
  { "name": "Albania", "code": "ALB", "full_name": "Republic of Albania" },
  { "name": "Algeria", "code": "DZA", "full_name": "People's Democratic Republic of Algeria" },
  { "name": "Andorra", "code": "AND", "full_name": "Principality of Andorra" },
  { "name": "Angola", "code": "AGO", "full_name": "Republic of Angola" },
  { "name": "Antigua and Barbuda", "code": "ATG", "full_name": "Antigua and Barbuda" },
  { "name": "Argentina", "code": "ARG", "full_name": "Argentine Republic" },
  { "name": "Armenia", "code": "ARM", "full_name": "Republic of Armenia" },
  { "name": "Australia", "code": "AUS", "full_name": "Commonwealth of Australia" },
  { "name": "Austria", "code": "AUT", "full_name": "Republic of Austria" },
  { "name": "Azerbaijan", "code": "AZE", "full_name": "Republic of Azerbaijan" },
  { "name": "Bahamas", "code": "BHS", "full_name": "Commonwealth of the Bahamas" },
  { "name": "Bahrain", "code": "BHR", "full_name": "Kingdom of Bahrain" },
  { "name": "Bangladesh", "code": "BGD", "full_name": "People's Republic of Bangladesh" },
  { "name": "Barbados", "code": "BRB", "full_name": "Barbados" },
  { "name": "Belarus", "code": "BLR", "full_name": "Republic of Belarus" },
  { "name": "Belgium", "code": "BEL", "full_name": "Kingdom of Belgium" },
  { "name": "Belize", "code": "BLZ", "full_name": "Belize" },
  { "name": "Benin", "code": "BEN", "full_name": "Republic of Benin" },
  { "name": "Bhutan", "code": "BTN", "full_name": "Kingdom of Bhutan" },
  { "name": "Bolivia", "code": "BOL", "full_name": "Plurinational State of Bolivia" },
  { "name": "Bosnia and Herzegovina", "code": "BIH", "full_name": "Bosnia and Herzegovina" },
  { "name": "Botswana", "code": "BWA", "full_name": "Republic of Botswana" },
  { "name": "Brazil", "code": "BRA", "full_name": "Federative Republic of Brazil" },
  { "name": "Brunei", "code": "BRN", "full_name": "Nation of Brunei, Abode of Peace" },
  { "name": "Bulgaria", "code": "BGR", "full_name": "Republic of Bulgaria" },
  { "name": "Burkina Faso", "code": "BFA", "full_name": "Burkina Faso" },
  { "name": "Burundi", "code": "BDI", "full_name": "Republic of Burundi" },
  { "name": "Cabo Verde", "code": "CPV", "full_name": "Republic of Cabo Verde" },
  { "name": "Cambodia", "code": "KHM", "full_name": "Kingdom of Cambodia" },
  { "name": "Cameroon", "code": "CMR", "full_name": "Republic of Cameroon" },
  { "name": "Canada", "code": "CAN", "full_name": "Canada" },
  { "name": "Central African Republic", "code": "CAF", "full_name": "Central African Republic" },
  { "name": "Chad", "code": "TCD", "full_name": "Republic of Chad" },
  { "name": "Chile", "code": "CHL", "full_name": "Republic of Chile" },
  { "name": "China", "code": "CHN", "full_name": "People's Republic of China" },
  { "name": "Colombia", "code": "COL", "full_name": "Republic of Colombia" },
  { "name": "Comoros", "code": "COM", "full_name": "Union of the Comoros" },
  { "name": "Congo (Congo-Brazzaville)", "code": "COG", "full_name": "Republic of the Congo" },
  { "name": "Costa Rica", "code": "CRI", "full_name": "Republic of Costa Rica" },
  { "name": "Croatia", "code": "HRV", "full_name": "Republic of Croatia" },
  { "name": "Cuba", "code": "CUB", "full_name": "Republic of Cuba" },
  { "name": "Cyprus", "code": "CYP", "full_name": "Republic of Cyprus" },
  { "name": "Czechia", "code": "CZE", "full_name": "Czech Republic" },
  { "name": "Denmark", "code": "DNK", "full_name": "Kingdom of Denmark" },
  { "name": "Djibouti", "code": "DJI", "full_name": "Republic of Djibouti" },
  { "name": "Dominica", "code": "DMA", "full_name": "Commonwealth of Dominica" },
  { "name": "Dominican Republic", "code": "DOM", "full_name": "Dominican Republic" },
  { "name": "Ecuador", "code": "ECU", "full_name": "Republic of Ecuador" },
  { "name": "Egypt", "code": "EGY", "full_name": "Arab Republic of Egypt" },
  { "name": "El Salvador", "code": "SLV", "full_name": "Republic of El Salvador" },
  { "name": "Equatorial Guinea", "code": "GNQ", "full_name": "Republic of Equatorial Guinea" },
  { "name": "Eritrea", "code": "ERI", "full_name": "State of Eritrea" },
  { "name": "Estonia", "code": "EST", "full_name": "Republic of Estonia" },
  { "name": "Eswatini", "code": "SWZ", "full_name": "Kingdom of Eswatini" },
  { "name": "Ethiopia", "code": "ETH", "full_name": "Federal Democratic Republic of Ethiopia" },
  { "name": "Fiji", "code": "FJI", "full_name": "Republic of Fiji" },
  { "name": "Finland", "code": "FIN", "full_name": "Republic of Finland" },
  { "name": "France", "code": "FRA", "full_name": "French Republic" },
  { "name": "Gabon", "code": "GAB", "full_name": "Gabonese Republic" },
  { "name": "Gambia", "code": "GMB", "full_name": "Republic of the Gambia" },
  { "name": "Georgia", "code": "GEO", "full_name": "Georgia" },
  { "name": "Germany", "code": "DEU", "full_name": "Federal Republic of Germany" },
  { "name": "Ghana", "code": "GHA", "full_name": "Republic of Ghana" },
  { "name": "Greece", "code": "GRC", "full_name": "Hellenic Republic" },
  { "name": "Grenada", "code": "GRD", "full_name": "Grenada" },
  { "name": "Guatemala", "code": "GTM", "full_name": "Republic of Guatemala" },
  { "name": "Guinea", "code": "GIN", "full_name": "Republic of Guinea" },
  { "name": "Guinea-Bissau", "code": "GNB", "full_name": "Republic of Guinea-Bissau" },
  { "name": "Guyana", "code": "GUY", "full_name": "Co-operative Republic of Guyana" },
  { "name": "Haiti", "code": "HTI", "full_name": "Republic of Haiti" },
  { "name": "Honduras", "code": "HND", "full_name": "Republic of Honduras" },
  { "name": "Hungary", "code": "HUN", "full_name": "Hungary" },
  { "name": "Iceland", "code": "ISL", "full_name": "Republic of Iceland" },
  { "name": "India", "code": "IND", "full_name": "Republic of India" },
  { "name": "Indonesia", "code": "IDN", "full_name": "Republic of Indonesia" },
  { "name": "Iran", "code": "IRN", "full_name": "Islamic Republic of Iran" },
  { "name": "Iraq", "code": "IRQ", "full_name": "Republic of Iraq" },
  { "name": "Ireland", "code": "IRL", "full_name": "Ireland" },
  { "name": "Israel", "code": "ISR", "full_name": "State of Israel" },
  { "name": "Italy", "code": "ITA", "full_name": "Italian Republic" },
  { "name": "Jamaica", "code": "JAM", "full_name": "Jamaica" },
  { "name": "Japan", "code": "JPN", "full_name": "Japan" },
  { "name": "Jordan", "code": "JOR", "full_name": "Hashemite Kingdom of Jordan" },
  { "name": "Kazakhstan", "code": "KAZ", "full_name": "Republic of Kazakhstan" },
  { "name": "Kenya", "code": "KEN", "full_name": "Republic of Kenya" },
  { "name": "Kiribati", "code": "KIR", "full_name": "Republic of Kiribati" },
  { "name": "Korea (North)", "code": "PRK", "full_name": "Democratic People's Republic of Korea" },
  { "name": "Korea (South)", "code": "KOR", "full_name": "Republic of Korea" },
  { "name": "Kuwait", "code": "KWT", "full_name": "State of Kuwait" },
  { "name": "Kyrgyzstan", "code": "KGZ", "full_name": "Kyrgyz Republic" },
  { "name": "Laos", "code": "LAO", "full_name": "Lao People's Democratic Republic" },
  { "name": "Latvia", "code": "LVA", "full_name": "Republic of Latvia" },
  { "name": "Lebanon", "code": "LBN", "full_name": "Lebanese Republic" },
  { "name": "Lesotho", "code": "LSO", "full_name": "Kingdom of Lesotho" },
  { "name": "Liberia", "code": "LBR", "full_name": "Republic of Liberia" },
  { "name": "Libya", "code": "LBY", "full_name": "State of Libya" },
  { "name": "Liechtenstein", "code": "LIE", "full_name": "Principality of Liechtenstein" },
  { "name": "Lithuania", "code": "LTU", "full_name": "Republic of Lithuania" },
  { "name": "Luxembourg", "code": "LUX", "full_name": "Grand Duchy of Luxembourg" },
  { "name": "Madagascar", "code": "MDG", "full_name": "Republic of Madagascar" },
  { "name": "Malawi", "code": "MWI", "full_name": "Republic of Malawi" },
  { "name": "Malaysia", "code": "MYS", "full_name": "Malaysia" },
  { "name": "Maldives", "code": "MDV", "full_name": "Republic of Maldives" },
  { "name": "Mali", "code": "MLI", "full_name": "Republic of Mali" },
  { "name": "Malta", "code": "MLT", "full_name": "Republic of Malta" },
  { "name": "Marshall Islands", "code": "MHL", "full_name": "Republic of the Marshall Islands" },
  { "name": "Mauritania", "code": "MRT", "full_name": "Islamic Republic of Mauritania" },
  { "name": "Mauritius", "code": "MUS", "full_name": "Republic of Mauritius" },
  { "name": "Mexico", "code": "MEX", "full_name": "United Mexican States" },
  { "name": "Micronesia", "code": "FSM", "full_name": "Federated States of Micronesia" },
  { "name": "Moldova", "code": "MDA", "full_name": "Republic of Moldova" },
  { "name": "Monaco", "code": "MCO", "full_name": "Principality of Monaco" },
  { "name": "Mongolia", "code": "MNG", "full_name": "Mongolia" },
  { "name": "Montenegro", "code": "MNE", "full_name": "Montenegro" },
  { "name": "Morocco", "code": "MAR", "full_name": "Kingdom of Morocco" },
  { "name": "Mozambique", "code": "MOZ", "full_name": "Republic of Mozambique" },
  { "name": "Myanmar (Burma)", "code": "MMR", "full_name": "Republic of the Union of Myanmar" },
  { "name": "Namibia", "code": "NAM", "full_name": "Republic of Namibia" },
  { "name": "Nauru", "code": "NRU", "full_name": "Republic of Nauru" },
  { "name": "Nepal", "code": "NPL", "full_name": "Federal Democratic Republic of Nepal" },
  { "name": "Netherlands", "code": "NLD", "full_name": "Kingdom of the Netherlands" },
  { "name": "New Zealand", "code": "NZL", "full_name": "New Zealand" },
  { "name": "Nicaragua", "code": "NIC", "full_name": "Republic of Nicaragua" },
  { "name": "Niger", "code": "NER", "full_name": "Republic of the Niger" },
  { "name": "Nigeria", "code": "NGA", "full_name": "Federal Republic of Nigeria" },
  { "name": "North Macedonia", "code": "MKD", "full_name": "Republic of North Macedonia" },
  { "name": "Norway", "code": "NOR", "full_name": "Kingdom of Norway" },
  { "name": "Oman", "code": "OMN", "full_name": "Sultanate of Oman" },
  { "name": "Pakistan", "code": "PAK", "full_name": "Islamic Republic of Pakistan" },
  { "name": "Palau", "code": "PLW", "full_name": "Republic of Palau" },
  { "name": "Palestine State", "code": "PSE", "full_name": "State of Palestine" },
  { "name": "Panama", "code": "PAN", "full_name": "Republic of Panama" },
  { "name": "Papua New Guinea", "code": "PNG", "full_name": "Independent State of Papua New Guinea" },
  { "name": "Paraguay", "code": "PRY", "full_name": "Republic of Paraguay" },
  { "name": "Peru", "code": "PER", "full_name": "Republic of Peru" },
  { "name": "Philippines", "code": "PHL", "full_name": "Republic of the Philippines" },
  { "name": "Poland", "code": "POL", "full_name": "Republic of Poland" },
  { "name": "Portugal", "code": "PRT", "full_name": "Portuguese Republic" },
  { "name": "Qatar", "code": "QAT", "full_name": "State of Qatar" },
  { "name": "Romania", "code": "ROU", "full_name": "Romania" },
  { "name": "Russia", "code": "RUS", "full_name": "Russian Federation" },
  { "name": "Rwanda", "code": "RWA", "full_name": "Republic of Rwanda" },
  { "name": "Saint Kitts and Nevis", "code": "KNA", "full_name": "Federation of Saint Kitts and Nevis" },
  { "name": "Saint Lucia", "code": "LCA", "full_name": "Saint Lucia" },
  { "name": "Saint Vincent and the Grenadines", "code": "VCT", "full_name": "Saint Vincent and the Grenadines" },
  { "name": "Samoa", "code": "WSM", "full_name": "Independent State of Samoa" },
  { "name": "San Marino", "code": "SMR", "full_name": "Republic of San Marino" },
  { "name": "Sao Tome and Principe", "code": "STP", "full_name": "Democratic Republic of Sao Tome and Principe" },
  { "name": "Saudi Arabia", "code": "SAU", "full_name": "Kingdom of Saudi Arabia" },
  { "name": "Senegal", "code": "SEN", "full_name": "Republic of Senegal" },
  { "name": "Serbia", "code": "SRB", "full_name": "Republic of Serbia" },
  { "name": "Seychelles", "code": "SYC", "full_name": "Republic of Seychelles" },
  { "name": "Sierra Leone", "code": "SLE", "full_name": "Republic of Sierra Leone" },
  { "name": "Singapore", "code": "SGP", "full_name": "Republic of Singapore" },
  { "name": "Slovakia", "code": "SVK", "full_name": "Slovak Republic" },
  { "name": "Slovenia", "code": "SVN", "full_name": "Republic of Slovenia" },
  { "name": "Solomon Islands", "code": "SLB", "full_name": "Solomon Islands" },
  { "name": "Somalia", "code": "SOM", "full_name": "Federal Republic of Somalia" },
  { "name": "South Africa", "code": "ZAF", "full_name": "Republic of South Africa" },
  { "name": "South Sudan", "code": "SSD", "full_name": "Republic of South Sudan" },
  { "name": "Spain", "code": "ESP", "full_name": "Kingdom of Spain" },
  { "name": "Sri Lanka", "code": "LKA", "full_name": "Democratic Socialist Republic of Sri Lanka" },
  { "name": "Sudan", "code": "SDN", "full_name": "Republic of the Sudan" },
  { "name": "Suriname", "code": "SUR", "full_name": "Republic of Suriname" },
  { "name": "Sweden", "code": "SWE", "full_name": "Kingdom of Sweden" },
  { "name": "Switzerland", "code": "CHE", "full_name": "Swiss Confederation" },
  { "name": "Syria", "code": "SYR", "full_name": "Syrian Arab Republic" },
  { "name": "Tajikistan", "code": "TJK", "full_name": "Republic of Tajikistan" },
  { "name": "Tanzania", "code": "TZA", "full_name": "United Republic of Tanzania" },
  { "name": "Thailand", "code": "THA", "full_name": "Kingdom of Thailand" },
  { "name": "Timor-Leste", "code": "TLS", "full_name": "Democratic Republic of Timor-Leste" },
  { "name": "Togo", "code": "TGO", "full_name": "Togolese Republic" },
  { "name": "Tonga", "code": "TON", "full_name": "Kingdom of Tonga" },
  { "name": "Trinidad and Tobago", "code": "TTO", "full_name": "Republic of Trinidad and Tobago" },
  { "name": "Tunisia", "code": "TUN", "full_name": "Tunisian Republic" },
  { "name": "Turkey", "code": "TUR", "full_name": "Republic of Turkey" },
  { "name": "Turkmenistan", "code": "TKM", "full_name": "Turkmenistan" },
  { "name": "Tuvalu", "code": "TUV", "full_name": "Tuvalu" },
  { "name": "Uganda", "code": "UGA", "full_name": "Republic of Uganda" },
  { "name": "Ukraine", "code": "UKR", "full_name": "Ukraine" },
  { "name": "United Arab Emirates", "code": "ARE", "full_name": "United Arab Emirates" },
  { "name": "United Kingdom", "code": "GBR", "full_name": "United Kingdom of Great Britain and Northern Ireland" },
  { "name": "United States of America", "code": "USA", "full_name": "United States of America" },
  { "name": "Uruguay", "code": "URY", "full_name": "Oriental Republic of Uruguay" },
  { "name": "Uzbekistan", "code": "UZB", "full_name": "Republic of Uzbekistan" },
  { "name": "Vanuatu", "code": "VUT", "full_name": "Republic of Vanuatu" },
  { "name": "Venezuela", "code": "VEN", "full_name": "Bolivarian Republic of Venezuela" },
  { "name": "Vietnam", "code": "VNM", "full_name": "Socialist Republic of Vietnam" },
  { "name": "Yemen", "code": "YEM", "full_name": "Republic of Yemen" },
  { "name": "Zambia", "code": "ZMB", "full_name": "Republic of Zambia" },
  { "name": "Zimbabwe", "code": "ZWE", "full_name": "Republic of Zimbabwe" }
]


function extractCountryName(nameFormGpt = "") {
  const lowerCase = nameFormGpt.toLowerCase();
  const current_country = passportCountries.find(({ code, full_name, name }) => lowerCase == code.toLowerCase() || lowerCase == full_name.toLowerCase() || lowerCase == name.toLowerCase())
  return current_country?.name ?? ""
}

module.exports = {
  passportCountries,
  extractCountryName
}