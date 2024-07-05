const passportCountries = [
    { name: "Afghanistan", code: "AFG" },
    { name: "Albania", code: "ALB" },
    { name: "Algeria", code: "DZA" },
    { name: "Andorra", code: "AND" },
    { name: "Angola", code: "AGO" },
    { name: "Antigua and Barbuda", code: "ATG" },
    { name: "Argentina", code: "ARG" },
    { name: "Armenia", code: "ARM" },
    { name: "Australia", code: "AUS" },
    { name: "Austria", code: "AUT" },
    { name: "Azerbaijan", code: "AZE" },
    { name: "Bahamas", code: "BHS" },
    { name: "Bahrain", code: "BHR" },
    { name: "Bangladesh", code: "BGD" },
    { name: "Barbados", code: "BRB" },
    { name: "Belarus", code: "BLR" },
    { name: "Belgium", code: "BEL" },
    { name: "Belize", code: "BLZ" },
    { name: "Benin", code: "BEN" },
    { name: "Bhutan", code: "BTN" },
    { name: "Bolivia", code: "BOL" },
    { name: "Bosnia and Herzegovina", code: "BIH" },
    { name: "Botswana", code: "BWA" },
    { name: "Brazil", code: "BRA" },
    { name: "Brunei", code: "BRN" },
    { name: "Bulgaria", code: "BGR" },
    { name: "Burkina Faso", code: "BFA" },
    { name: "Burundi", code: "BDI" },
    { name: "Cabo Verde", code: "CPV" },
    { name: "Cambodia", code: "KHM" },
    { name: "Cameroon", code: "CMR" },
    { name: "Canada", code: "CAN" },
    { name: "Central African Republic", code: "CAF" },
    { name: "Chad", code: "TCD" },
    { name: "Chile", code: "CHL" },
    { name: "China", code: "CHN" },
    { name: "Colombia", code: "COL" },
    { name: "Comoros", code: "COM" },
    { name: "Congo (Congo-Brazzaville)", code: "COG" },
    { name: "Congo (DRC)", code: "COD" },
    { name: "Costa Rica", code: "CRI" },
    { name: "Croatia", code: "HRV" },
    { name: "Cuba", code: "CUB" },
    { name: "Cyprus", code: "CYP" },
    { name: "Czechia (Czech Republic)", code: "CZE" },
    { name: "Denmark", code: "DNK" },
    { name: "Djibouti", code: "DJI" },
    { name: "Dominica", code: "DMA" },
    { name: "Dominican Republic", code: "DOM" },
    { name: "Ecuador", code: "ECU" },
    { name: "Egypt", code: "EGY" },
    { name: "El Salvador", code: "SLV" },
    { name: "Equatorial Guinea", code: "GNQ" },
    { name: "Eritrea", code: "ERI" },
    { name: "Estonia", code: "EST" },
    { name: "Eswatini (fmr. Swaziland)", code: "SWZ" },
    { name: "Ethiopia", code: "ETH" },
    { name: "Fiji", code: "FJI" },
    { name: "Finland", code: "FIN" },
    { name: "France", code: "FRA" },
    { name: "Gabon", code: "GAB" },
    { name: "Gambia", code: "GMB" },
    { name: "Georgia", code: "GEO" },
    { name: "Germany", code: "DEU" },
    { name: "Ghana", code: "GHA" },
    { name: "Greece", code: "GRC" },
    { name: "Grenada", code: "GRD" },
    { name: "Guatemala", code: "GTM" },
    { name: "Guinea", code: "GIN" },
    { name: "Guinea-Bissau", code: "GNB" },
    { name: "Guyana", code: "GUY" },
    { name: "Haiti", code: "HTI" },
    { name: "Honduras", code: "HND" },
    { name: "Hungary", code: "HUN" },
    { name: "Iceland", code: "ISL" },
    { name: "India", code: "IND" },
    { name: "Indonesia", code: "IDN" },
    { name: "Iran", code: "IRN" },
    { name: "Iraq", code: "IRQ" },
    { name: "Ireland", code: "IRL" },
    { name: "Israel", code: "ISR" },
    { name: "Italy", code: "ITA" },
    { name: "Jamaica", code: "JAM" },
    { name: "Japan", code: "JPN" },
    { name: "Jordan", code: "JOR" },
    { name: "Kazakhstan", code: "KAZ" },
    { name: "Kenya", code: "KEN" },
    { name: "Kiribati", code: "KIR" },
    { name: "Kuwait", code: "KWT" },
    { name: "Kyrgyzstan", code: "KGZ" },
    { name: "Laos", code: "LAO" },
    { name: "Latvia", code: "LVA" },
    { name: "Lebanon", code: "LBN" },
    { name: "Lesotho", code: "LSO" },
    { name: "Liberia", code: "LBR" },
    { name: "Libya", code: "LBY" },
    { name: "Liechtenstein", code: "LIE" },
    { name: "Lithuania", code: "LTU" },
    { name: "Luxembourg", code: "LUX" },
    { name: "Madagascar", code: "MDG" },
    { name: "Malawi", code: "MWI" },
    { name: "Malaysia", code: "MYS" },
    { name: "Maldives", code: "MDV" },
    { name: "Mali", code: "MLI" },
    { name: "Malta", code: "MLT" },
    { name: "Marshall Islands", code: "MHL" },
    { name: "Mauritania", code: "MRT" },
    { name: "Mauritius", code: "MUS" },
    { name: "Mexico", code: "MEX" },
    { name: "Micronesia", code: "FSM" },
    { name: "Moldova", code: "MDA" },
    { name: "Monaco", code: "MCO" },
    { name: "Mongolia", code: "MNG" },
    { name: "Montenegro", code: "MNE" },
    { name: "Morocco", code: "MAR" },
    { name: "Mozambique", code: "MOZ" },
    { name: "Myanmar (formerly Burma)", code: "MMR" },
    { name: "Namibia", code: "NAM" },
    { name: "Nauru", code: "NRU" },
    { name: "Nepal", code: "NPL" },
    { name: "Netherlands", code: "NLD" },
    { name: "New Zealand", code: "NZL" },
    { name: "Nicaragua", code: "NIC" },
    { name: "Niger", code: "NER" },
    { name: "Nigeria", code: "NGA" },
    { name: "North Korea", code: "PRK" },
    { name: "North Macedonia", code: "MKD" },
    { name: "Norway", code: "NOR" },
    { name: "Oman", code: "OMN" },
    { name: "Pakistan", code: "PAK" },
    { name: "Palau", code: "PLW" },
    { name: "Palestine State", code: "PSE" },
    { name: "Panama", code: "PAN" },
    { name: "Papua New Guinea", code: "PNG" },
    { name: "Paraguay", code: "PRY" },
    { name: "Peru", code: "PER" },
    { name: "Philippines", code: "PHL" },
    { name: "Poland", code: "POL" },
    { name: "Portugal", code: "PRT" },
    { name: "Qatar", code: "QAT" },
    { name: "Romania", code: "ROU" },
    { name: "Russia", code: "RUS" },
    { name: "Rwanda", code: "RWA" },
    { name: "Saint Kitts and Nevis", code: "KNA" },
    { name: "Saint Lucia", code: "LCA" },
    { name: "Saint Vincent and the Grenadines", code: "VCT" },
    { name: "Samoa", code: "WSM" },
    { name: "San Marino", code: "SMR" },
    { name: "Sao Tome and Principe", code: "STP" },
    { name: "Saudi Arabia", code: "SAU" },
    { name: "Senegal", code: "SEN" },
    { name: "Serbia", code: "SRB" },
    { name: "Seychelles", code: "SYC" },
    { name: "Sierra Leone", code: "SLE" },
    { name: "Singapore", code: "SGP" },
    { name: "Slovakia", code: "SVK" },
    { name: "Slovenia", code: "SVN" },
    { name: "Solomon Islands", code: "SLB" },
    { name: "Somalia", code: "SOM" },
    { name: "South Africa", code: "ZAF" },
    { name: "South Korea", code: "KOR" },
    { name: "South Sudan", code: "SSD" },
    { name: "Spain", code: "ESP" },
    { name: "Sri Lanka", code: "LKA" },
    { name: "Sudan", code: "SDN" },
    { name: "Suriname", code: "SUR" },
    { name: "Sweden", code: "SWE" },
    { name: "Switzerland", code: "CHE" },
    { name: "Syria", code: "SYR" },
    { name: "Tajikistan", code: "TJK" },
    { name: "Tanzania", code: "TZA" },
    { name: "Thailand", code: "THA" },
    { name: "Timor-Leste", code: "TLS" },
    { name: "Togo", code: "TGO" },
    { name: "Tonga", code: "TON" },
    { name: "Trinidad and Tobago", code: "TTO" },
    { name: "Tunisia", code: "TUN" },
    { name: "Turkey", code: "TUR" },
    { name: "Turkmenistan", code: "TKM" },
    { name: "Tuvalu", code: "TUV" },
    { name: "Uganda", code: "UGA" },
    { name: "Ukraine", code: "UKR" },
    { name: "United Arab Emirates", code: "ARE" },
    { name: "United Kingdom", code: "GBR" },
    { name: "United States of America", code: "USA" },
    { name: "Uruguay", code: "URY" },
    { name: "Uzbekistan", code: "UZB" },
    { name: "Vanuatu", code: "VUT" },
    { name: "Vatican City", code: "VAT" },
    { name: "Venezuela", code: "VEN" },
    { name: "Vietnam", code: "VNM" },
    { name: "Yemen", code: "YEM" },
    { name: "Zambia", code: "ZMB" },
    { name: "Zimbabwe", code: "ZWE" }
  ];

  module.exports =  {
    passportCountries
  }