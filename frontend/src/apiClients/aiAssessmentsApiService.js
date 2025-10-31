import axios from "axios";

const API_KEY = process.env.REACT_APP_AI_ASSISTANCE_API_KEY;

const scienceApi = async (prompt, subject) => {
  try {
    const response = await axios.post(
      "https://apps.akratech.in:8874/science/ask",
      {
        prompt,
        subject,
        model: "llama-3.3-70b-versatile",
      },
      {
        headers: {
          accept: "application/json",
          "api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.response;
  } catch (error) {
    throw new Error("Failed to fetch science API response.");
  }
};

const codingApi = async (prompt, language) => {
  try {
    const response = await axios.post(
      "https://apps.akratech.in:8874/coding-tutor/ask",
      {
        prompt,
        language,
        model: "llama-3.3-70b-versatile",
      },
      {
        headers: {
          accept: "application/json",
          "api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.response;
  } catch (error) {
    throw new Error("Failed to fetch coding API response.");
  }
};

const mathTutorApi = async (prompt, topic) => {
  try {
    const response = await axios.post(
      "https://apps.akratech.in:8874/math-tutor/ask",
      {
        prompt,
        topic,
        model: "llama-3.3-70b-versatile",
      },
      {
        headers: {
          accept: "application/json",
          "api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.response;
  } catch (error) {
    throw new Error("Failed to fetch coding API response.");
  }
};



const AtlearnAIAssistant = async(query)=>{
  try{
    const response = await axios.post(
      "https://apps.akratech.in:8874/atlearn-assistant/ask_question/",
      {
        query,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response?.data?.rag_response;
  }catch(error){
    throw new Error("Failed to fetch coding API response.");
  }
}

const getAIAssistants = async () => {
  try {
    const response = await axios.get(
      "https://atbridges.ai/api/chat-assisstant/education",
      {
        headers: {
          'Authorization': 'Bearer 3|ohY8gE5rtJeCqbBz97WDMBcS23xYbo8av0p6DTCI'
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error("Failed to fetch AI assistant response.");
  }
};

const YoutubeAnalysisAI = async(path,url)=>{
  try{
    const response = await axios.post(
      `https://apps.akratech.in:8874${path}`,
      {
         video_url: url 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      }
    );
    return response?.data;
  }catch(error){
    throw new Error("Failed to fetch coding API response.");
  }
}

export { scienceApi, codingApi,AtlearnAIAssistant,mathTutorApi,getAIAssistants,YoutubeAnalysisAI };
