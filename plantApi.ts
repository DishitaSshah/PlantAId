import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface DiseaseAnalysisResult {
  disease: string;
  confidence: number;
  treatment: string;
}

export async function analyzeLeafDisease(image: File): Promise<DiseaseAnalysisResult> {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await axios.post<DiseaseAnalysisResult>(
      `${API_URL}/analyze`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to analyze image');
    }
    throw error;
  }
}
