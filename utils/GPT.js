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
                        text: "extract in English fullName,firstName,lastName,sex,documentNumber,expirationDate and birthDate as format 16,01,2025, city_of_Issue, country from this passport as JSON only"
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
    extractFields
}