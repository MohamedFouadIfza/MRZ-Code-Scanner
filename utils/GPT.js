const OpenAI = require('openai').default

const extractFields = (str) => {
    const fieldPattern = /"(\w+)":\s*"([^"]+)"/g;
    let match;
    const result = {};

    while ((match = fieldPattern.exec(str)) !== null) {
        const [, key, value] = match;
        result[key] = value;
    }

    return result;
};

const monthMap = {
    "JAN": "01",
    "FEB": "02",
    "MAR": "03",
    "APR": "04",
    "MAY": "05",
    "JUN": "06",
    "JUL": "07",
    "AUG": "08",
    "SEP": "09",
    "OCT": "10",
    "NOV": "11",
    "DEC": "12"
  };

const extractAndConvertFields = (str) => {
    const fieldPattern = /"(\w+)":\s*"([^"]+)"/g;
    let match;
    const result = {};
  
    while ((match = fieldPattern.exec(str)) !== null) {
      const [, key, value] = match;
      if (key === 'birthDate' || key === 'expirationDate') {
        const dateParts = value.split(' ');
        const day = dateParts[0].padStart(2, '0');
        const month = monthMap[dateParts[1]?.toUpperCase()];
        const year = dateParts[2];
        result[key] = `${day}-${month}-${year}`;
      } else {
        result[key] = value;
      }
    }
  
    return result;
  };

const getPassportDetails = async (base64Image) => {
    const openai = new OpenAI({
        apiKey: process.env.NEW_API
    })
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: 'text',
                        text: "act as passport reader, extract in English fullName,firstName,lastName,sex,documentNumber,expirationDate and birthDate as format 16,01,2025, country_of_Issue, country country not nationalty from this passport as JSON only"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: base64Image
                        }
                    }
                ]
            }
        ]
    })
    console.log("response.choices[0].message.content", response.choices[0].message.content)
    return extractFields(response.choices[0].message.content)
}

module.exports = {
    getPassportDetails,
}