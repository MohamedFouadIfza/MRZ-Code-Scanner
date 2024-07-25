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
                        text: "act as passport reader, extract in English fullName,firstName,lastName,sex,documentNumber,expirationDate and birthDate as format 16,01,2025,place of Issue,country_of_Issue,nationalty as Alpha 3 code as JSON only"
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


// const getPassportDetailsAssistant = async (base64Image) => {
//     const openai = new OpenAI({
//         apiKey: process.env.NEW_API
//     })

//     const assistant = await openai.beta.assistants.create({
//         model: "gpt-4o",
//         instructions: "you will extract passport information by giving you passport copy and you will use MRZ code or read the information direct from the passport copy if MRZ code unclear, extract all information as JSON only.",
//         name: "Passport Information Extractor",
//         response_format: { type: "json_object" }
//     })

//     const thread = await openai.beta.threads.create()
    

//     const message = await openai.beta.threads.messages.create(thread.id, {
//         role: "user",
//         content: base64Image
//         // content: [{
//         //     ty
//         //     "image_base64": base64Image
//         //     // type: "image_url",
//         //     // image_url: {
//         //     //     url: base64Image
//         //     // }
//         // }],

//     })

//     const run = await openai.beta.threads.runs.createAndPoll(
//         thread.id,
//         {
//             assistant_id: assistant.id,
//         }
//     );

//     if (run.status === 'completed') {
//         const messages = await openai.beta.threads.messages.list(
//             run.thread_id
//         );
//         for (const message of messages.data.reverse()) {
//             console.log(`${message.role} > ${message.content[0].text.value}`);
//         }
//     } else {
//         console.log(run.status);
//     }
// }

module.exports = {
    getPassportDetails,
    // getPassportDetailsAssistant
}